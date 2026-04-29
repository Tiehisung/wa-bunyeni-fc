// app/api/search/quick/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import MatchModel from '@/models/match';
import NewsModel from '@/models/news';
import PlayerModel from '@/models/player';
import { LoggerService } from '../../../../shared/log.service';
import { getApiErrorMessage } from '../../../../lib/error-api';

connectDB();

// GET /api/search/quick - Quick search for autocomplete
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const basePath = session?.user?.role?.includes('admin') ? '/admin' : '';

        const searchParams = request.nextUrl.searchParams;
        const q = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '5');

        if (!q || q.trim().length < 1) {
            return NextResponse.json({
                success: true,
                data: []
            });
        }

        const searchTerm = q.trim();
        const regex = new RegExp(searchTerm, 'i');

        const [players, matches, news] = await Promise.all([
            PlayerModel.find({ $or: [{ firstName: regex }, { lastName: regex }] })
                .select('firstName lastName avatar position slug _id')
                .limit(limit)
                .lean(),
            MatchModel.find({ $or: [{ title: regex }, { 'opponent.name': regex }] })
                .select('title opponent date status slug _id')
                .limit(limit)
                .lean(),
            NewsModel.find({ 'headline.text': regex, isPublished: true })
                .select('headline slug _id')
                .limit(limit)
                .lean()
        ]);

        const results = [
            ...players.map(p => ({
                type: 'player',
                label: `${p.firstName} ${p.lastName}`,
                value: p.slug || p._id,
                url: basePath ? `${basePath}/players/${p.slug || p._id}` : `/players/details?playerId=${p.slug || p._id}`,
                image: p.avatar,
                subtitle: p.position
            })),
            ...matches.map(m => ({
                type: 'match',
                label: m.title,
                value: m.slug || m._id,
                url: `${basePath ? basePath : ''}/matches/${m.slug || m._id}`,
                subtitle: `${m.status} | ${new Date(m.date).toLocaleDateString()}`
            })),
            ...news.map(n => ({
                type: 'news',
                label: n.headline.text.substring(0, 60),
                value: n.slug || n._id,
                url: `${basePath ? basePath : ''}/news/${n.slug || n._id}`,
                subtitle: 'News article'
            }))
        ];

        return NextResponse.json({
            success: true,
            data: results.slice(0, limit)
        });
    } catch (error) {
        LoggerService.error('Quick search failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Quick search failed'),
        }, { status: 500 });
    }
}
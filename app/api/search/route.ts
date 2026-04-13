// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/config/db.config';
import { auth } from '@/auth';
import MatchModel from '@/models/match';
import DocModel from '@/models/doc';
import NewsModel from '@/models/news';
import PlayerModel from '@/models/player';
import SponsorModel from '@/models/sponsor';
import GalleryModel from '@/models/galleries';
import { LoggerService } from '../../../shared/log.service';
import { getApiErrorMessage } from '../../../lib/error-api';

connectDB();

interface SearchResult {
    type: string;
    id: string;
    title: string;
    description?: string;
    image?: string;
    url: string;
    date?: string;
    relevance: number;
    metadata?: any;
}

// Helper function to safely get string from query param
const getQueryString = (param: string | string[] | undefined): string | undefined => {
    if (!param) return undefined;
    if (typeof param === 'string') return param;
    if (Array.isArray(param)) return param[0];
    return undefined;
};

// Search Players
async function searchPlayers(regex: RegExp, fromDate?: string, toDate?: string, basePath: string = ''): Promise<SearchResult[]> {
    try {
        const query: any = {
            $or: [
                { firstName: regex },
                { lastName: regex },
                { email: regex },
                { position: regex },
                { number: regex },
                { 'training.team': regex }
            ]
        };

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }

        const players = await PlayerModel.find(query)
            .select('firstName lastName avatar position number training team status slug createdAt')
            .limit(50)
            .lean();

        return players.map(player => {
            let relevance = 0;
            const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
            if (fullName.includes(regex.source.toLowerCase())) relevance += 10;
            if (player.position?.toLowerCase().includes(regex.source.toLowerCase())) relevance += 5;
            if (player.number?.toString().includes(regex.source)) relevance += 3;

            return {
                type: 'player',
                id: player._id.toString(),
                title: `${player.firstName} ${player.lastName}`,
                description: `${player.position} | #${player.number} | Team ${player.training?.team || 'N/A'}`,
                image: player.avatar,
                url: basePath ? `${basePath}/players/${player.slug}` : `/players/details?playerId=${player.slug}`,
                date: player.createdAt,
                relevance,
                metadata: {
                    position: player.position,
                    number: player.number,
                    team: player.training?.team,
                    status: player.status
                }
            };
        });
    } catch (error) {
        console.error('Error searching players:', error);
        return [];
    }
}

// Search Matches
async function searchMatches(regex: RegExp, fromDate?: string, toDate?: string, basePath: string = ''): Promise<SearchResult[]> {
    try {
        const query: any = {
            $or: [
                { title: regex },
                { 'opponent.name': regex },
                { venue: regex },
                { status: regex }
            ]
        };

        if (fromDate || toDate) {
            query.date = {};
            if (fromDate) query.date.$gte = new Date(fromDate);
            if (toDate) query.date.$lte = new Date(toDate);
        }

        const matches = await MatchModel.find(query)
            .select('title opponent date time status venue isHome slug')
            .populate('opponent')
            .limit(50)
            .lean({ virtuals: true });

        return matches.map(match => {
            let relevance = 0;
            if (match.title.toLowerCase().includes(regex.source.toLowerCase())) relevance += 10;
            if (match.opponent?.name?.toLowerCase().includes(regex.source.toLowerCase())) relevance += 8;

            return {
                type: 'match',
                id: match._id.toString(),
                title: match.title,
                description: `${match.opponent?.name} | ${match.venue} | ${match.status}`,
                image: match.opponent?.logo,
                url: `${basePath ? basePath : ''}/matches/${match.slug || match._id}`,
                date: match.date,
                relevance,
                metadata: {
                    opponent: match.opponent?.name,
                    venue: match.venue,
                    status: match.status,
                    isHome: match.isHome,
                    time: match.time
                }
            };
        });
    } catch (error) {
        console.error('Error searching matches:', error);
        return [];
    }
}

// Search News
async function searchNews(regex: RegExp, fromDate?: string, toDate?: string, basePath: string = ''): Promise<SearchResult[]> {
    try {
        const query: any = {
            isPublished: true,
            $or: [
                { 'headline.text': regex },
                { 'details.text': regex },
                { tags: regex },
                { 'reporter.name': regex }
            ]
        };

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }

        const news = await NewsModel.find(query)
            .select('headline details reporter tags createdAt slug')
            .limit(50)
            .lean();

        return news.map(article => {
            let relevance = 0;
            if (article.headline.text.toLowerCase().includes(regex.source.toLowerCase())) relevance += 10;
            if (article.tags?.some((tag: string) => tag.toLowerCase().includes(regex.source.toLowerCase()))) relevance += 5;

            return {
                type: 'news',
                id: article._id.toString(),
                title: article.headline.text,
                description: article.details?.find((d: { text: string }) => d.text)?.text?.substring(0, 200) || '',
                image: article.headline.image,
                url: `${basePath ? basePath : ''}/news/${article.slug || article._id}`,
                date: article.createdAt,
                relevance,
                metadata: {
                    reporter: article.reporter?.name,
                    tags: article.tags
                }
            };
        });
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
}

// Search Sponsors
async function searchSponsors(regex: RegExp, basePath: string = ''): Promise<SearchResult[]> {
    try {
        const sponsors = await SponsorModel.find({
            $or: [
                { name: regex },
                { businessName: regex },
                { businessDescription: regex }
            ]
        })
            .select('name businessName logo businessDescription')
            .limit(30)
            .lean();

        return sponsors.map(sponsor => ({
            type: 'sponsor',
            id: sponsor._id.toString(),
            title: sponsor.businessName || sponsor.name,
            description: sponsor.businessDescription?.substring(0, 200) || '',
            image: sponsor.logo,
            url: `${basePath ? basePath : ''}/sponsorship/${sponsor._id}`,
            relevance: sponsor.name?.toLowerCase().includes(regex.source.toLowerCase()) ? 10 : 5,
            metadata: {
                owner: sponsor.name,
                businessName: sponsor.businessName
            }
        }));
    } catch (error) {
        console.error('Error searching sponsors:', error);
        return [];
    }
}

// Search Galleries
async function searchGalleries(regex: RegExp, basePath: string = ''): Promise<SearchResult[]> {
    try {
        const galleries = await GalleryModel.find({
            $or: [
                { title: regex },
                { description: regex },
                { tags: regex }
            ]
        })
            .select('title description files tags')
            .limit(30)
            .lean();

        return galleries.map(gallery => ({
            type: 'gallery',
            id: gallery._id.toString(),
            title: gallery.title,
            description: gallery.description?.substring(0, 200) || '',
            image: gallery.files?.[0]?.secure_url,
            url: `${basePath ? basePath : ''}/gallery?gallery_search=${encodeURIComponent(gallery.title)}`,
            relevance: gallery.title?.toLowerCase().includes(regex.source.toLowerCase()) ? 10 : 5,
            metadata: {
                tags: gallery.tags,
                fileCount: gallery.files?.length || 0
            }
        }));
    } catch (error) {
        console.error('Error searching galleries:', error);
        return [];
    }
}

// Search Documents (admin only)
async function searchDocuments(regex: RegExp, basePath: string = ''): Promise<SearchResult[]> {
    try {
        const documents = await DocModel.find({
            $or: [
                { name: regex },
                { original_filename: regex },
                { description: regex },
                { tags: regex }
            ]
        })
            .select('name original_filename description secure_url tags folder')
            .limit(30)
            .lean();

        return documents.map(doc => ({
            type: 'document',
            id: doc._id.toString(),
            title: doc.name || doc.original_filename || 'Untitled',
            description: doc.description?.substring(0, 200) || '',
            image: '/pdf-icon.png',
            url: `${basePath ? basePath : ''}/admin/docs/${doc._id}`,
            relevance: doc.name?.toLowerCase().includes(regex.source.toLowerCase()) ? 10 : 5,
            metadata: {
                folder: doc.folder,
                tags: doc.tags,
                filename: doc.original_filename
            }
        }));
    } catch (error) {
        console.error('Error searching documents:', error);
        return [];
    }
}

// GET /api/search - Global search
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        const basePath = session?.user?.role?.includes('admin') ? '/admin' : '';

        const searchParams = request.nextUrl.searchParams;
        const q = searchParams.get('q');
        const types = searchParams.get('types') || 'players,matches,news,sponsors,galleries,docs';
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const fromDate = getQueryString(searchParams.get('fromDate') || undefined);
        const toDate = getQueryString(searchParams.get('toDate') || undefined);

        if (!q || q.trim().length < 2) {
            return NextResponse.json({
                success: false,
                message: 'Search query must be at least 2 characters'
            }, { status: 400 });
        }

        const searchTypes = (types as string).split(',');
        const skip = (page - 1) * limit;
        const searchTerm = q.trim();
        const regex = new RegExp(searchTerm, 'i');

        const results: SearchResult[] = [];
        const promises = [];

        if (searchTypes.includes('players')) {
            promises.push(searchPlayers(regex, fromDate, toDate, basePath));
        }
        if (searchTypes.includes('matches')) {
            promises.push(searchMatches(regex, fromDate, toDate, basePath));
        }
        if (searchTypes.includes('news')) {
            promises.push(searchNews(regex, fromDate, toDate, basePath));
        }
        if (searchTypes.includes('sponsors')) {
            promises.push(searchSponsors(regex, basePath));
        }
        if (searchTypes.includes('galleries')) {
            promises.push(searchGalleries(regex, basePath));
        }
        if (searchTypes.includes('docs') && session?.user?.role?.includes('admin')) {
            promises.push(searchDocuments(regex, basePath));
        }

        const allResults = await Promise.all(promises);
        for (const resultArray of allResults) {
            results.push(...resultArray);
        }

        // Sort by relevance (higher score first)
        results.sort((a, b) => b.relevance - a.relevance);

        const paginatedResults = results.slice(skip, skip + limit);
        const total = results.length;
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: paginatedResults,
            pagination: {
                page,
                limit,
                total,
                pages: totalPages
            },
            searchTerm
        });
    } catch (error) {
        LoggerService.error('Search failed', error);
        return NextResponse.json({
            success: false,
            message: getApiErrorMessage(error, 'Search failed'),
        }, { status: 500 });
    }
}
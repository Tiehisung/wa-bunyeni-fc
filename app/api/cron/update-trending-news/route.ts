
import { NextRequest, NextResponse } from 'next/server';
import { updateAllTrendingScores } from './calculator';
import { getApiErrorMessage } from '@/lib/error-api';

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret for security
        const authHeader = request.headers.get('authorization');
        const expectedSecret = process.env.CRON_SECRET;

        if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const count = await updateAllTrendingScores();

        return NextResponse.json({
            success: true,
            message: `Trending scores updated for ${count} items`,
            data: {
                count,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json(
            { success: false, message: getApiErrorMessage(error) },
            { status: 500 }
        );
    }
}
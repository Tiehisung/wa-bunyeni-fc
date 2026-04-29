
import { NextRequest, NextResponse } from 'next/server';
import { updateAllTrendingScores } from './calculator';
import { getApiErrorMessage } from '@/lib/error-api';


//This vercel cron route will be triggered every day at 1:00 AM 
// to update the trending scores of news items based on their engagement metrics. 
// The route is protected by a secret token to prevent unauthorized access.
// Make sure to set the CRON_SECRET environment variable in your Vercel project settings for security.
//Hobby plan allows 2 cron jobs, so we will update trending scores once a day. For more frequent updates, consider upgrading your Vercel plan.
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
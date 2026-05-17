// app/api/shorten/route.ts
import { NextRequest, NextResponse } from "next/server";

const BITLY_API_URL = "https://api-ssl.bitly.com/v4/shorten";
const BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN;

export async function GET(request: NextRequest) {
  // 1. Check if the access token is configured
  if (!BITLY_ACCESS_TOKEN) {
    console.error("Missing BITLY_ACCESS_TOKEN environment variable");
    return NextResponse.json(
      { message: "Server configuration error", success: false },
      { status: 500 },
    );
  }

  try {
    // 2. Get the long URL from the request body
    const longUrl = request.nextUrl.searchParams.get("longUrl");

    if (!longUrl) {
      return NextResponse.json(
        { message: "Missing 'longUrl' in request body", success: false },
        { status: 400 },
      );
    }

    // 3. Call the Bitly API
    const bitlyResponse = await fetch(BITLY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ long_url: longUrl }),
    });

    const bitlyData = await bitlyResponse.json();

    // 4. Check if the Bitly API call was successful
    if (!bitlyResponse.ok) {
      console.error("Bitly API Error:", bitlyData);
      // Handle common errors (e.g., invalid URL, rate limiting)
      return NextResponse.json(
        {
          message: bitlyData.message || "Failed to shorten URL",
          success: false,
        },
        { status: bitlyResponse.status },
      );
    }

    // 5. Return the shortened link to the client
    return NextResponse.json({ data: bitlyData.link, success: true });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred", success: false },
      { status: 500 },
    );
  }
}

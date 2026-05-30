// app/api/shorten/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get the long URL from query params
    const longUrl = request.nextUrl.searchParams.get("longUrl");

    if (!longUrl) {
      return NextResponse.json(
        { message: "Missing 'longUrl' query parameter", success: false },
        { status: 400 },
      );
    }

    // Validate URL format
    try {
      new URL(longUrl);
    } catch {
      return NextResponse.json(
        { message: "Invalid URL format", success: false },
        { status: 400 },
      );
    }

    // Call TinyURL API (returns plain text, not JSON)
    const tinyUrlResponse = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`,
    );

    if (!tinyUrlResponse.ok) {
      throw new Error(`TinyURL API returned ${tinyUrlResponse.status}`);
    }

    // TinyURL returns the shortened URL as plain text
    const shortUrl = await tinyUrlResponse.text();

    return NextResponse.json({
      success: true,
      data: shortUrl,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Failed to shorten URL", success: false },
      { status: 500 },
    );
  }
}

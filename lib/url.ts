import { ENV } from "./env";

// lib/shorten-url.ts
export async function shortenUrlWithBitly(longUrl: string): Promise<string> {
  try {
    // Call your own Next.js API route
    const response = await fetch(
      `${ENV.APP_URL}/api/shorten?longUrl=${longUrl}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to shorten URL");
    }

    const result = await response.json();
    return result.data || longUrl;
  } catch (error) {
    return longUrl; // Fallback to the original URL on error
  }
}

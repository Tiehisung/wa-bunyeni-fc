// client/lib/seo.ts
import { ENV } from "./env";

// OG Image URLs (for meta tags)
export const playerOgImage = (id: string) => `${ENV.API_URL}/og/player/${id}`;
export const matchOgImage = (id: string) => `${ENV.API_URL}/og/match/${id}`;
export const defaultOgImage = () => `${ENV.API_URL}/og/default`;

// SHARE URLs (what you share on social media)
export const getPlayerShareUrl = (id: string) =>
    `${ENV.API_URL.replace("/api", "")}/seo/player/${id}`;

export const getMatchShareUrl = (id: string) =>
    `${ENV.API_URL.replace("/api", "")}/seo/match/${id}`;

// Frontend URLs (internal navigation)
export const getPlayerFrontendUrl = (id: string) =>
    `${ENV.APP_URL}/players/details?playerId=${id}`;

export const getMatchFrontendUrl = (id: string) =>
    `${ENV.APP_URL}/matches/${id}`;
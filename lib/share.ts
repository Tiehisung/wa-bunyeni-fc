// utils/share.ts



export interface ShareOptions {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
}

interface ShareData {
    title: string;
    text: string;
    url: string;
    files?: File[];
}

export interface ShareResult {
    success: boolean;
    message?: string;
    error?: string;
}

export const shareUrl = ({ url, title, description }: { url: string; title: string; description: string; }) => {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: description,
            url: url || window.location.href,
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        // You might want to add a toast notification here
    }
}

/**
 * Check if Web Share API is supported
 */
export function isWebShareSupported(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Check if Web Share Files API is supported
 */
export function isWebShareFilesSupported(): boolean {
    return isWebShareSupported() && !!navigator.canShare;
}

/**
 * Main share function that uses Web Share API with fallbacks
 */
export async function sharePage(options: ShareOptions = {}): Promise<ShareResult> {
    const {
        title = document.title,
        text = '',
        url = typeof window !== 'undefined' ? window.location.href : '',
        files
    } = options;

    try {
        // Try Web Share API first
        if (isWebShareSupported()) {
            const shareData: ShareData = {
                title,
                text,
                url,
            };

            // Add files if supported and provided
            if (files && isWebShareFilesSupported()) {
                if (navigator.canShare({ files })) {
                    shareData.files = files;
                }
            }

            await navigator.share(shareData);

            return {
                success: true,
                message: 'Shared successfully!'
            };
        }

        // Fallback: Copy to clipboard
        return await copyToClipboard(url, title);

    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            // User cancelled the share
            return {
                success: false,
                message: 'Share cancelled'
            };
        }

        // Fallback to clipboard if Web Share fails
        try {
            return await copyToClipboard(url, title);
        } catch (clipboardError) {
            return {
                success: false,
                message: 'Failed to share or copy to clipboard'
            };
        }
    }
}

/**
 * Copy text to clipboard with fallbacks
 */
export async function copyToClipboard(
    text: string,
    successMessage?: string
): Promise<ShareResult> {
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return {
                success: true,
                message: successMessage || 'Copied to clipboard!'
            };
        }

        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            return {
                success: true,
                message: successMessage || 'Copied to clipboard!'
            };
        }

        throw new Error('Clipboard copy failed');

    } catch (error) {
        return {
            success: false,
            message: 'Failed to copy to clipboard'
        };
    }
}

/**
 * Share to specific social platforms
 */
export async function shareToSocial(
    platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp' | 'telegram',
    options: ShareOptions = {}
): Promise<ShareResult> {
    const {
         
        text = '',
        url = typeof window !== 'undefined' ? window.location.href : '',
    } = options;

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(`${text} ${url}`);
    // const encodedTitle = encodeURIComponent(title);

    const shareUrls: Record<string, string> = {
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        whatsapp: `https://wa.me/?text=${encodedText}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${text}`,
    };

    const shareUrl = shareUrls[platform];

    if (!shareUrl) {
        return {
            success: false,
            message: `Unsupported platform: ${platform}`
        };
    }

    try {
        // Open in new window for better UX
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            shareUrl,
            'share',
            `width=${width},height=${height},left=${left},top=${top},toolbar=0,status=0`
        );

        return {
            success: true,
            message: `Opening ${platform}...`
        };
    } catch (error) {
        return {
            success: false,
            message: `Failed to share to ${platform}`
        };
    }
}

/**
 * Generate shareable link with parameters
 */
export function generateShareableLink(
    baseUrl: string,
    params: Record<string, string | number | boolean> = {}
): string {
    const url = new URL(baseUrl);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
        }
    });

    return url.toString();
}

/**
 * Generate QR code URL for sharing
 */
export function generateQRCodeUrl(
    url: string,
    options: {
        size?: number;
        format?: 'png' | 'svg' | 'jpeg';
        margin?: number;
    } = {}
): string {
    const {
        size = 300,
        format = 'png',
        margin = 1
    } = options;

    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}&format=${format}&margin=${margin}`;
}

/**
 * Email sharing utility
 */
export function shareViaEmail(options: {
    to?: string;
    subject?: string;
    body?: string;
    url?: string;
} = {}): void {
    const {
        to = '',
        subject = document.title,
        body = '',
        url = window.location.href
    } = options;

    const emailBody = `${body}\n\n${url}`;
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

    window.location.href = mailtoUrl;
}

/**
 * Share utility with analytics tracking
 */
export async function shareWithAnalytics(
    options: ShareOptions & {
        platform?: string;
        eventName?: string;
        analyticsCallback?: (data: unknown) => void;
    }
): Promise<ShareResult> {
    const {
        platform,
        eventName = 'share',
        analyticsCallback,
        ...shareOptions
    } = options;

    const result = await sharePage(shareOptions);

    // Track analytics if callback provided
    if (analyticsCallback && result.success) {
        analyticsCallback({
            event: eventName,
            platform: platform || (isWebShareSupported() ? 'web_share_api' : 'clipboard'),
            url: shareOptions.url || window.location.href,
            title: shareOptions.title || document.title,
            timestamp: new Date().toISOString()
        });
    }

    return result;
}

export const share = {
    viaEmail: shareViaEmail,
    page: sharePage,
    generateQR: generateQRCodeUrl,
    generateShareableLink,
    toSocial: shareToSocial,
    copyToClipboard,
    withAnalytics: shareWithAnalytics,
}


// utils/download.ts

import { IFileProps, IGallery } from '@/types/file.interface';

export interface DownloadItem {
    url: string;
    filename: string;
    type?: string;
}

export interface DownloadOptions {
    onProgress?: (current: number, total: number) => void;
    onComplete?: (successful: number, failed: number) => void;
    onError?: (item: DownloadItem, error: Error) => void;
    batchSize?: number;
    timeout?: number;
}

/**
 * Download a single file
 */
export const downloadFile = async (url: string, filename: string): Promise<boolean> => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
        return true;
    } catch (error) {
        console.error(`Failed to download ${filename}:`, error);
        return false;
    }
};

/**
 * Download multiple files sequentially
 */
export const downloadMultiple = async (
    items: DownloadItem[],
    options: DownloadOptions = {}
): Promise<{ successful: number; failed: number }> => {
    const {
        onProgress,
        onComplete,
        onError,
        batchSize = 1,
        timeout = 30000,
    } = options;

    let successful = 0;
    let failed = 0;

    const downloadWithTimeout = async (item: DownloadItem): Promise<boolean> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(item.url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = item.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl);
            return true;
        } catch (error) {
            clearTimeout(timeoutId);
            onError?.(item, error as Error);
            return false;
        }
    };

    // Process in batches to avoid browser blocking
    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(item => downloadWithTimeout(item)));

        const batchSuccessful = results.filter(r => r).length;
        const batchFailed = results.filter(r => !r).length;

        successful += batchSuccessful;
        failed += batchFailed;

        onProgress?.(Math.min(i + batchSize, items.length), items.length);

        // Small delay between batches
        if (i + batchSize < items.length) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    onComplete?.(successful, failed);
    return { successful, failed };
};

/**
 * Download multiple files with ZIP compression (requires JSZip)
 * npm install jszip
 */
export const downloadAsZip = async (
    items: DownloadItem[],
    zipName: string = 'download.zip',
    options: DownloadOptions = {}
): Promise<boolean> => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    const { onProgress, onError } = options;
    let completed = 0;

    try {
        for (const item of items) {
            try {
                const response = await fetch(item.url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const blob = await response.blob();
                zip.file(item.filename, blob);

                completed++;
                onProgress?.(completed, items.length);
            } catch (error) {
                onError?.(item, error as Error);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const blobUrl = URL.createObjectURL(content);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = zipName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
        return true;
    } catch (error) {
        console.error('Failed to create zip:', error);
        return false;
    }
};

/**
 * Download files from Cloudinary (optimized for your app)
 */
export const downloadCloudinaryFiles = async (
    files: Array<{ secure_url: string; original_filename?: string; format?: string }>,
    options: DownloadOptions = {}
) => {
    const downloadItems: DownloadItem[] = files.map(file => ({
        url: file.secure_url,
        filename: `${file.original_filename || 'file'}.${file.format || 'jpg'}`,
    }));

    return downloadMultiple(downloadItems, options);
};

/**
 * Download gallery as ZIP
 */
export const downloadGalleryAsZip = async (
    gallery: IGallery,
    options: DownloadOptions = {}
) => {
    const items = gallery?.files?.map(file => ({
        url: file.secure_url,
        filename: `${gallery?.title}_${file.original_filename || Date.now()}.${file.format || 'jpg'}`,
    }));

    return downloadAsZip(items, `${gallery?.title}.zip`, options);
};
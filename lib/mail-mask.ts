// utils/maskEmail.ts

/**
 * Masks an email address showing only first 3 characters and domain
 * @param email - The email address to mask
 * @param options - Masking options
 * @returns Masked email string
 */
export function maskEmail(
    email: string,
    options?: {
        visibleChars?: number;      // Number of characters to show at start (default: 3)
        maskChar?: string;          // Character to use for masking (default: '*')
        preserveDomain?: boolean;   // Whether to show full domain (default: true)
        preserveTLD?: boolean;      // Whether to show TLD (default: true)
    }
): string {
    if (!email || !email.includes('@')) {
        return email;
    }

    const {
        visibleChars = 3,
        maskChar = '*',
        preserveDomain = true,
        preserveTLD = true,
    } = options || {};

    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) return email;

    // Mask local part
    let maskedLocal: string;

    if (localPart.length <= visibleChars) {
        // If local part is shorter than visible chars, show all and add mask
        maskedLocal = localPart + maskChar.repeat(3);
    } else {
        const visible = localPart.slice(0, visibleChars);
        const masked = maskChar.repeat(Math.min(localPart.length - visibleChars, 5));
        maskedLocal = visible + masked;
    }

    // Handle domain masking
    if (!preserveDomain) {
        return `${maskedLocal}@${maskChar.repeat(domain.length)}`;
    }

    if (preserveTLD) {
        // Show full domain (including TLD)
        return `${maskedLocal}@${domain}`;
    } else {
        // Mask domain but preserve TLD
        const [domainName, ...tldParts] = domain.split('.');
        const tld = tldParts.join('.');

        if (domainName.length <= 2) {
            return `${maskedLocal}@${domainName}.${tld}`;
        }

        const visibleDomain = domainName.slice(0, 2);
        const maskedDomain = maskChar.repeat(Math.min(domainName.length - 2, 3));
        return `${maskedLocal}@${visibleDomain}${maskedDomain}.${tld}`;
    }
}
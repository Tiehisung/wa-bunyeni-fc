import DOMPurify from 'dompurify';

export function scrollToElement(elementId: string) {
    setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, 10)
}

export const scrollToSection = (id?: string) => {
    if (!id) return
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
};

export const toggleClick = (id?: string) => {
    setTimeout(() => {
        const doc = document.getElementById(id as string);
        if (doc) doc.click();
    }, 1);
};

export function pathnameToLinks(
    pathname: string
): { path: string; text: string }[] {
    const segments = pathname.split('/').filter(Boolean); // Split and remove empty segments
    let path = '';
    return segments.map((segment) => {
        path += `/${segment}`;
        return { path, text: segment };
    });
}


export const markupToPlainText = (text: string): string => {
    if (!text) return '';

    try {
        // Sanitize first
        const sanitizedHTML = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: [
                'p',
                'br',
                'ul',
                'ol',
                'li',
                'strong',
                'em',
                'span',
                'div',
            ],
            ALLOWED_ATTR: [],
        });

        // Create temporary element and extract only text content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sanitizedHTML;

        // Get plain text and clean up
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        return plainText
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim();
    } catch (error) {
        console.error('Error processing markup:', error);
        return text
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
};

export const markupToString = (text: string): string => {
    if (!text) return '';

    try {
        // First, sanitize the HTML to prevent XSS attacks
        const sanitizedHTML = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: [
                'p',
                'br',
                'ul',
                'ol',
                'li',
                'strong',
                'em',
                'span',
                'div',
            ],
            ALLOWED_ATTR: [],
        });

        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = sanitizedHTML;

        // Convert different HTML elements to appropriate text representations
        const processNode = (node: Node): string => {
            if (node.nodeType === Node.TEXT_NODE) {
                return node.textContent || '';
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                const tagName = element.tagName.toLowerCase();

                let result = '';

                // Handle different elements appropriately
                switch (tagName) {
                    case 'br':
                        return ' ';
                    case 'p':
                    case 'div':
                        // Add space after paragraphs/divs
                        result =
                            Array.from(element.childNodes).map(processNode).join('') + ' ';
                        break;
                    case 'li': {
                        const parent = element.parentElement;
                        if (parent?.tagName.toLowerCase() === 'ul') {
                            result =
                                ',' +
                                Array.from(element.childNodes).map(processNode).join('') +
                                ' ';
                        } else if (parent?.tagName.toLowerCase() === 'ol') {
                            const index = Array.from(parent.children).indexOf(element) + 1;
                            result =
                                `${index}, ` +
                                Array.from(element.childNodes).map(processNode).join('') +
                                ' ';
                        } else {
                            result =
                                Array.from(element.childNodes).map(processNode).join('') + ' ';
                        }
                        break;
                    }
                    case 'ul':
                    case 'ol':
                        // Process list items
                        result = Array.from(element.childNodes).map(processNode).join('');
                        break;
                    default:
                        // For other elements, just get the text content
                        result = Array.from(element.childNodes).map(processNode).join('');
                }

                return result;
            }

            return '';
        };

        let plainText = Array.from(tempDiv.childNodes).map(processNode).join('');

        // Clean up extra whitespace and normalize
        plainText = plainText
            .replace(/\s+/g, ' ')
            .replace(/\s*•\s*/g, ', ')
            .replace(/\s*\d+\.\s*/g, (match) => ` ${match.trim()} `)
            .trim();

        return plainText;
    } catch (error) {
        console.error('Error processing markup:', error);
        return text
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
};


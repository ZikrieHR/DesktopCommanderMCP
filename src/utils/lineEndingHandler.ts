/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - High-performance version
 * Uses native indexOf (C++/SIMD) to jump directly to the first newline character
 * instead of iterating character-by-character in JavaScript.
 */
export function detectLineEnding(content: string): LineEndingStyle {
    const firstCR = content.indexOf('\r');
    const firstLF = content.indexOf('\n');

    if (firstCR === -1 && firstLF === -1) {
        return process.platform === 'win32' ? '\r\n' : '\n';
    }

    if (firstCR !== -1 && (firstLF === -1 || firstCR < firstLF)) {
        if (firstCR + 1 < content.length && content.charCodeAt(firstCR + 1) === 10) {
            return '\r\n';
        }
        return '\r';
    }

    return '\n';
}

/**
 * Helper function to count occurrences of a substring using fast native indexOf search
 */
function countOccurrences(str: string, sub: string): number {
    let count = 0;
    let pos = str.indexOf(sub);
    while (pos !== -1) {
        count++;
        pos = str.indexOf(sub, pos + sub.length);
    }
    return count;
}

/**
 * Normalize line endings to match the target style - High-performance version
 * Includes fast-path early returns and avoids redundant multi-pass regex replacements
 * when text is already normalized or contains no line endings.
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    const hasCR = text.includes('\r');
    const hasLF = text.includes('\n');

    // Fast path 1: Text contains no line endings at all
    if (!hasCR && !hasLF) {
        return text;
    }

    // Fast path 2: Text only has LF (\n) line endings
    if (!hasCR) {
        if (targetLineEnding === '\n') return text;
        if (targetLineEnding === '\r\n') return text.replaceAll('\n', '\r\n');
        return text.replaceAll('\n', '\r');
    }

    // Fast path 3: Text only has CR (\r) line endings
    if (!hasLF) {
        if (targetLineEnding === '\r') return text;
        if (targetLineEnding === '\r\n') return text.replaceAll('\r', '\r\n');
        return text.replaceAll('\r', '\n');
    }

    // Both CR and LF exist in text
    // Check if text is already pure CRLF without standalone CR or LF
    if (targetLineEnding === '\r\n') {
        let isPureCRLF = true;
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (code === 13) { // \r
                if (i + 1 >= text.length || text.charCodeAt(i + 1) !== 10) { // not \n
                    isPureCRLF = false;
                    break;
                }
                i++;
            } else if (code === 10) { // standalone \n
                isPureCRLF = false;
                break;
            }
        }
        if (isPureCRLF) return text;
    }

    // Standard fallback for mixed line endings
    const normalized = text.replace(/\r\n/g, '\n').replaceAll('\r', '\n');
    if (targetLineEnding === '\r\n') {
        return normalized.replaceAll('\n', '\r\n');
    } else if (targetLineEnding === '\r') {
        return normalized.replaceAll('\n', '\r');
    }
    
    return normalized;
}

/**
 * Analyze line ending usage in content - High-performance version
 * Uses native indexOf searches rather than slow character-by-character JS array indexing.
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    const hasCR = content.indexOf('\r') !== -1;
    const hasLF = content.indexOf('\n') !== -1;

    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;

    if (hasCR && hasLF) {
        const totalCR = countOccurrences(content, '\r');
        const totalLF = countOccurrences(content, '\n');
        crlfCount = countOccurrences(content, '\r\n');
        crCount = totalCR - crlfCount;
        lfCount = totalLF - crlfCount;
    } else if (hasCR) {
        crCount = countOccurrences(content, '\r');
    } else if (hasLF) {
        lfCount = countOccurrences(content, '\n');
    }

    // Determine predominant style
    const total = crlfCount + lfCount + crCount;
    let style: LineEndingStyle;

    if (crlfCount > lfCount && crlfCount > crCount) {
        style = '\r\n';
    } else if (lfCount > crCount) {
        style = '\n';
    } else {
        style = '\r';
    }

    // Check for mixed line endings
    const usedStyles = [crlfCount > 0, lfCount > 0, crCount > 0].filter(Boolean).length;
    const hasMixed = usedStyles > 1;

    return {
        style,
        count: total,
        hasMixed
    };
}

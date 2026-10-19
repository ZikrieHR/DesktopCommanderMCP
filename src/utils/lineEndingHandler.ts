/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - Optimized version
 * Uses native `indexOf` for fast C++ level string scanning instead of JS char iteration
 */
export function detectLineEnding(content: string): LineEndingStyle {
    const crIndex = content.indexOf('\r');
    const lfIndex = content.indexOf('\n');

    if (crIndex === -1 && lfIndex === -1) {
        // Default to system line ending if no line endings found
        return process.platform === 'win32' ? '\r\n' : '\n';
    }

    if (crIndex !== -1 && (lfIndex === -1 || crIndex < lfIndex)) {
        if (crIndex + 1 < content.length && content.charCodeAt(crIndex + 1) === 10) {
            return '\r\n';
        }
        return '\r';
    }

    return '\n';
}

/**
 * Normalize line endings to match the target style
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    // First normalize to LF
    let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Then convert to target
    if (targetLineEnding === '\r\n') {
        return normalized.replace(/\n/g, '\r\n');
    } else if (targetLineEnding === '\r') {
        return normalized.replace(/\n/g, '\r');
    }
    
    return normalized;
}

/**
 * Analyze line ending usage in content
 * Uses String.prototype.indexOf for fast jump-scanning across line breaks instead of single-char stepping
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;

    let pos = 0;
    const len = content.length;

    while (pos < len) {
        const nextCr = content.indexOf('\r', pos);
        const nextLf = content.indexOf('\n', pos);

        if (nextCr === -1 && nextLf === -1) {
            break;
        }

        if (nextCr !== -1 && (nextLf === -1 || nextCr < nextLf)) {
            if (nextCr + 1 < len && content.charCodeAt(nextCr + 1) === 10) {
                crlfCount++;
                pos = nextCr + 2;
            } else {
                crCount++;
                pos = nextCr + 1;
            }
        } else {
            lfCount++;
            pos = nextLf + 1;
        }
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
    const usedStyles = (crlfCount > 0 ? 1 : 0) + (lfCount > 0 ? 1 : 0) + (crCount > 0 ? 1 : 0);
    const hasMixed = usedStyles > 1;

    return {
        style,
        count: total,
        hasMixed
    };
}

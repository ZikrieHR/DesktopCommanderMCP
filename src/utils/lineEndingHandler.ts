/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - Optimized version
 * This algorithm uses early termination for maximum performance
 */
export function detectLineEnding(content: string): LineEndingStyle {
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '\r') {
            if (i + 1 < content.length && content[i + 1] === '\n') {
                return '\r\n';
            }
            return '\r';
        }
        if (content[i] === '\n') {
            return '\n';
        }
    }
    
    // Default to system line ending if no line endings found
    return process.platform === 'win32' ? '\r\n' : '\n';
}

/**
 * Normalize line endings to match the target style.
 * Performance optimized: Uses fast-path for text already lacking carriage returns
 * and single-pass regex replacement instead of sequential passes.
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    // Fast path: if text contains no '\r' (common for LF files), skip the initial normalization pass
    if (!text.includes('\r')) {
        if (targetLineEnding === '\n') {
            return text;
        } else if (targetLineEnding === '\r\n') {
            return text.replace(/\n/g, '\r\n');
        } else if (targetLineEnding === '\r') {
            return text.replace(/\n/g, '\r');
        }
    }

    // Normalize \r\n and standalone \r to LF in a single pass
    const normalized = text.replace(/\r\n?/g, '\n');

    // Convert to target style
    if (targetLineEnding === '\r\n') {
        return normalized.replace(/\n/g, '\r\n');
    } else if (targetLineEnding === '\r') {
        return normalized.replace(/\n/g, '\r');
    }

    return normalized;
}

/**
 * Analyze line ending usage in content
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;
    
    // Count line endings
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '\r') {
            if (i + 1 < content.length && content[i + 1] === '\n') {
                crlfCount++;
                i++; // Skip the LF
            } else {
                crCount++;
            }
        } else if (content[i] === '\n') {
            lfCount++;
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
    const usedStyles = [crlfCount > 0, lfCount > 0, crCount > 0].filter(Boolean).length;
    const hasMixed = usedStyles > 1;
    
    return {
        style,
        count: total,
        hasMixed
    };
}

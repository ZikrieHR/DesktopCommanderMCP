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
 *
 * Optimization:
 * 1. Fast path for already-matching strings: avoids regex allocation/scanning completely
 *    when standard LF strings don't contain '\r'.
 * 2. Single-pass regex replacement: replaces CRLF and CR in a single pass instead of
 *    performing multiple regex replaces and intermediate string copies.
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    if (targetLineEnding === '\n') {
        // Fast path: if there are no carriage returns, text is already normalized to LF
        if (!text.includes('\r')) {
            return text;
        }
        // Single pass: replace both \r\n and standalone \r with \n
        return text.replace(/\r\n?/g, '\n');
    }

    if (targetLineEnding === '\r\n') {
        // Fast path: if there are no carriage returns, simple LF -> CRLF conversion
        if (!text.includes('\r')) {
            return text.replace(/\n/g, '\r\n');
        }
        // Single pass: replace all line endings (\r\n, \n, \r) with \r\n
        return text.replace(/\r?\n|\r/g, '\r\n');
    }

    if (targetLineEnding === '\r') {
        // Fast path: if already pure CR (contains CR, no LF)
        if (!text.includes('\n') && text.includes('\r')) {
            return text;
        }
        // Single pass: replace all line endings with \r
        return text.replace(/\r?\n|\r/g, '\r');
    }

    return text;
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

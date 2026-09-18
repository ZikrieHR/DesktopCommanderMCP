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
 * Performance optimized to avoid redundant allocations and multi-pass regexes:
 * - If text already uses the target style (e.g. standard LF on Linux), return as-is.
 * - Single-pass replacements when line endings are mixed or converted.
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    if (targetLineEnding === '\n') {
        // Fast path: if no carriage returns exist, text is already normalized LF
        if (!text.includes('\r')) return text;
        return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }
    
    if (targetLineEnding === '\r\n') {
        // Fast path: if no carriage returns, simple conversion of \n to \r\n
        if (!text.includes('\r')) {
            return text.replace(/\n/g, '\r\n');
        }
        // Fast path: if no line feeds, simple conversion of \r to \r\n
        if (!text.includes('\n')) {
            return text.replace(/\r/g, '\r\n');
        }
        // Single pass for mixed / CRLF input: match existing \r\n, single \n, or standalone \r
        return text.replace(/\r?\n|\r/g, '\r\n');
    }

    if (targetLineEnding === '\r') {
        if (!text.includes('\n')) return text;
        return text.replace(/\r?\n/g, '\r');
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

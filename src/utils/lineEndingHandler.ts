/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file.
 * Optimization: Uses native V8 C++ regex matching to find the first line ending match
 * immediately without JS character indexing overhead or scanning past the first newline.
 */
export function detectLineEnding(content: string): LineEndingStyle {
    const match = content.match(/\r\n?|\n/);
    if (!match) {
        // Default to system line ending if no line endings found
        return process.platform === 'win32' ? '\r\n' : '\n';
    }
    return match[0] as LineEndingStyle;
}

/**
 * Normalize line endings to match the target style.
 * Optimization: Uses non-allocating fast-path checks and single-pass regex replacement.
 * Prevents multiple sequential intermediate string allocations and redundant regex passes.
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    if (targetLineEnding === '\n') {
        // Fast path: if there are no CR characters, string is already LF normalized
        if (!text.includes('\r')) {
            return text;
        }
        // Single pass convert any \r\n or standalone \r to \n
        return text.replace(/\r?\n|\r/g, '\n');
    } else if (targetLineEnding === '\r\n') {
        // Fast path: if there are no CR characters, directly replace \n with \r\n in 1 pass
        if (!text.includes('\r')) {
            return text.replace(/\n/g, '\r\n');
        }
        // Single pass convert any \r\n, \n or \r to \r\n
        return text.replace(/\r?\n|\r/g, '\r\n');
    } else {
        // Fast path for CR: if no \n or \r\n present
        if (!text.includes('\n') && !text.includes('\r\n')) {
            return text;
        }
        // Single pass convert any \r\n, \n or \r to \r
        return text.replace(/\r?\n|\r/g, '\r');
    }
}

/**
 * Analyze line ending usage in content.
 * Optimization: Uses charCodeAt instead of string index access content[i] to avoid
 * creating 1-char string primitives on every iteration.
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;
    
    // Count line endings using numeric character codes
    for (let i = 0; i < content.length; i++) {
        const code = content.charCodeAt(i);
        if (code === 13) { // '\r'
            if (i + 1 < content.length && content.charCodeAt(i + 1) === 10) { // '\n'
                crlfCount++;
                i++; // Skip the LF
            } else {
                crCount++;
            }
        } else if (code === 10) { // '\n'
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

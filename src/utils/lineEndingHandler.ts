/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - Optimized version
 * Uses early termination and charCodeAt to avoid 1-char string heap allocations
 */
export function detectLineEnding(content: string): LineEndingStyle {
    const len = content.length;
    for (let i = 0; i < len; i++) {
        const code = content.charCodeAt(i);
        if (code === 13) { // '\r'
            if (i + 1 < len && content.charCodeAt(i + 1) === 10) { // '\n'
                return '\r\n';
            }
            return '\r';
        }
        if (code === 10) { // '\n'
            return '\n';
        }
    }
    
    // Default to system line ending if no line endings found
    return process.platform === 'win32' ? '\r\n' : '\n';
}

/**
 * Normalize line endings to match the target style.
 * Optimized with fast-path checks (!text.includes('\r')) to avoid unnecessary
 * regex executions and string allocations when normalizing standard LF text.
 * Single-pass regex replacements are used instead of multiple passes.
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    if (targetLineEnding === '\n') {
        // Fast path: if there are no CRs, the text is already normalized to LF
        if (!text.includes('\r')) return text;
        // Single pass replaces both \r\n and standalone \r with \n
        return text.replace(/\r\n?/g, '\n');
    }
    
    if (targetLineEnding === '\r\n') {
        if (!text.includes('\r')) {
            // Text only has LF (or no newlines); convert LF to CRLF in single pass
            return text.replace(/\n/g, '\r\n');
        }
        // Normalize mixed \r\n / \r to \n first, then convert \n to \r\n
        return text.replace(/\r\n?/g, '\n').replace(/\n/g, '\r\n');
    }

    if (targetLineEnding === '\r') {
        if (!text.includes('\n')) {
            // Text has no LFs; normalize any \r\n to \r
            return text.replace(/\r\n/g, '\r');
        }
        // Replace \r\n, \n, and \r with \r
        return text.replace(/\r\n?|\n/g, '\r');
    }
    
    return text;
}

/**
 * Analyze line ending usage in content
 * Uses charCodeAt for zero heap allocations in loop
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;
    
    // Count line endings using character code checks to avoid string allocations
    const len = content.length;
    for (let i = 0; i < len; i++) {
        const code = content.charCodeAt(i);
        if (code === 13) { // '\r'
            if (i + 1 < len && content.charCodeAt(i + 1) === 10) { // '\n'
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

/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - Optimized version
 * This algorithm uses early termination for maximum performance
 */
export function detectLineEnding(content: string): LineEndingStyle {
    // Optimized: Use native String.indexOf which is implemented in fast C++ in V8,
    // avoiding JS character indexing overhead in long strings.
    const crIdx = content.indexOf('\r');
    const lfIdx = content.indexOf('\n');

    if (crIdx === -1 && lfIdx === -1) {
        return process.platform === 'win32' ? '\r\n' : '\n';
    }

    if (crIdx !== -1 && (lfIdx === -1 || crIdx < lfIdx)) {
        if (crIdx + 1 < content.length && content[crIdx + 1] === '\n') {
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
    const hasCR = text.includes('\r');
    const hasLF = text.includes('\n');

    // Fast path: No line endings present in text
    if (!hasCR && !hasLF) {
        return text;
    }

    // Fast path: Standard LF text (Unix style, no CR)
    if (!hasCR) {
        if (targetLineEnding === '\n') return text;
        if (targetLineEnding === '\r\n') return text.replace(/\n/g, '\r\n');
        return text.replace(/\n/g, '\r');
    }

    // Fast path: Pure CR text (legacy Mac style, no LF)
    if (!hasLF) {
        if (targetLineEnding === '\r') return text;
        if (targetLineEnding === '\n') return text.replace(/\r/g, '\n');
        return text.replace(/\r/g, '\r\n');
    }

    // Single-pass replacement for mixed or CRLF text instead of chained multi-pass replacements
    if (targetLineEnding === '\n') {
        return text.replace(/\r\n?/g, '\n');
    } else if (targetLineEnding === '\r\n') {
        return text.replace(/\r?\n|\r/g, '\r\n');
    } else {
        return text.replace(/\r?\n|\r/g, '\r');
    }
}

/**
 * Analyze line ending usage in content
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    const defaultStyle = process.platform === 'win32' ? '\r\n' : '\n';

    // Fast path: Check if content has any line endings at all
    if (!content.includes('\r') && !content.includes('\n')) {
        return {
            style: defaultStyle,
            count: 0,
            hasMixed: false
        };
    }

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

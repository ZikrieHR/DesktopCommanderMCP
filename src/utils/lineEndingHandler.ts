/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - Optimized version
 * This algorithm uses early termination for maximum performance
 */
export function detectLineEnding(content: string): LineEndingStyle {
    const len = content.length;
    for (let i = 0; i < len; i++) {
        const code = content.charCodeAt(i);
        if (code === 13 /* '\r' */) {
            if (i + 1 < len && content.charCodeAt(i + 1) === 10 /* '\n' */) {
                return '\r\n';
            }
            return '\r';
        }
        if (code === 10 /* '\n' */) {
            return '\n';
        }
    }
    
    // Default to system line ending if no line endings found
    return process.platform === 'win32' ? '\r\n' : '\n';
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
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;
    
    // Count line endings using charCodeAt to avoid string allocations
    const len = content.length;
    for (let i = 0; i < len; i++) {
        const code = content.charCodeAt(i);
        if (code === 13 /* '\r' */) {
            if (i + 1 < len && content.charCodeAt(i + 1) === 10 /* '\n' */) {
                crlfCount++;
                i++; // Skip the LF
            } else {
                crCount++;
            }
        } else if (code === 10 /* '\n' */) {
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

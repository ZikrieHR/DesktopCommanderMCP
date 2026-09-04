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
 * Fast-path optimized to minimize regex passes and string allocations:
 * - Direct return for LF target on text with no CR
 * - Single-pass regex replacement /\r\n?/g for CR/CRLF conversion
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    if (targetLineEnding === '\n') {
        // Fast path: if text has no carriage returns, it's already pure LF
        if (!text.includes('\r')) {
            return text;
        }
        // Single pass: replace both \r\n and standalone \r with \n
        return text.replace(/\r\n?/g, '\n');
    }
    
    if (targetLineEnding === '\r\n') {
        // Fast path: if text has no carriage returns, directly convert \n to \r\n
        if (!text.includes('\r')) {
            return text.replace(/\n/g, '\r\n');
        }
        // Single pass normalize to LF, then convert to CRLF
        return text.replace(/\r\n?/g, '\n').replace(/\n/g, '\r\n');
    }

    if (targetLineEnding === '\r') {
        // Single pass normalize to LF, then convert to CR
        return text.replace(/\r\n?/g, '\n').replace(/\n/g, '\r');
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

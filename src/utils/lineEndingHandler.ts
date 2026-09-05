/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - Optimized version
 * Uses `indexOf` native string searching to jump directly to line breaks instead of scanning
 * character-by-character, drastically speeding up line ending detection on large strings.
 */
export function detectLineEnding(content: string): LineEndingStyle {
    const idxCR = content.indexOf('\r');
    const idxLF = content.indexOf('\n');

    // No line endings found
    if (idxCR === -1 && idxLF === -1) {
        return process.platform === 'win32' ? '\r\n' : '\n';
    }

    // CR occurs before LF or no LF exists
    if (idxCR !== -1 && (idxLF === -1 || idxCR < idxLF)) {
        return content.charCodeAt(idxCR + 1) === 10 ? '\r\n' : '\r';
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
 * Optimized to use `indexOf` jump scanning rather than inspecting every single character.
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
    while (pos < content.length) {
        const idxCR = content.indexOf('\r', pos);
        const idxLF = content.indexOf('\n', pos);

        if (idxCR === -1 && idxLF === -1) {
            break;
        }

        if (idxCR !== -1 && (idxLF === -1 || idxCR < idxLF)) {
            if (idxCR + 1 < content.length && content.charCodeAt(idxCR + 1) === 10) {
                crlfCount++;
                pos = idxCR + 2;
            } else {
                crCount++;
                pos = idxCR + 1;
            }
        } else {
            lfCount++;
            pos = idxLF + 1;
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

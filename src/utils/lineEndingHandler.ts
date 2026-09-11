/**
 * Line ending types
 */
export type LineEndingStyle = '\r\n' | '\n' | '\r';

/**
 * Detect the line ending style used in a file - High Performance
 * Inspects initial 8KB chunk using native string search (O(1) for large files)
 * before searching full content.
 */
export function detectLineEnding(content: string): LineEndingStyle {
    // Optimization: check initial 8KB chunk first using native indexOf to avoid
    // character-by-character JS loop over large strings.
    const sample = content.length > 8192 ? content.slice(0, 8192) : content;
    const firstCR = sample.indexOf('\r');
    const firstLF = sample.indexOf('\n');

    if (firstCR !== -1 || firstLF !== -1) {
        if (firstCR === -1) return '\n';
        if (firstLF === -1) {
            // Check boundary in case \r is at sample end and \n is immediately next
            return content.charAt(firstCR + 1) === '\n' ? '\r\n' : '\r';
        }
        return firstCR < firstLF ? (firstCR + 1 === firstLF ? '\r\n' : '\r') : '\n';
    }

    if (content.length > 8192) {
        const fullCR = content.indexOf('\r');
        const fullLF = content.indexOf('\n');
        if (fullCR !== -1 || fullLF !== -1) {
            if (fullCR === -1) return '\n';
            if (fullLF === -1) return content.charAt(fullCR + 1) === '\n' ? '\r\n' : '\r';
            return fullCR < fullLF ? (fullCR + 1 === fullLF ? '\r\n' : '\r') : '\n';
        }
    }

    // Default to system line ending if no line endings found
    return process.platform === 'win32' ? '\r\n' : '\n';
}

/**
 * Normalize line endings to match the target style - High Performance
 * Skips regex passes when text is already normalized and uses single-pass regex conversion.
 */
export function normalizeLineEndings(text: string, targetLineEnding: LineEndingStyle): string {
    // Optimization: Early-return if text is already normalized to target style,
    // avoiding unnecessary string allocations. Use single-pass regex replace otherwise.
    if (targetLineEnding === '\n') {
        if (!text.includes('\r')) {
            return text;
        }
        return text.replace(/\r\n?/g, '\n');
    } else if (targetLineEnding === '\r\n') {
        if (!text.includes('\r')) {
            return text.replace(/\n/g, '\r\n');
        }
        if (!text.includes('\n')) {
            return text.replace(/\r/g, '\r\n');
        }
        return text.replace(/\r?\n|\r/g, '\r\n');
    } else if (targetLineEnding === '\r') {
        if (!text.includes('\n') && !text.includes('\r\n')) {
            return text;
        }
        return text.replace(/\r?\n|\r/g, '\r');
    }

    return text;
}

/**
 * Analyze line ending usage in content - High Performance
 * Fast-paths pure LF or pure CR files using V8 C++ regex match counts.
 */
export function analyzeLineEndings(content: string): {
    style: LineEndingStyle;
    count: number;
    hasMixed: boolean;
} {
    let crlfCount = 0;
    let lfCount = 0;
    let crCount = 0;

    // Optimization: Fast path for pure LF or pure CR files using native match counter.
    if (!content.includes('\r')) {
        const matches = content.match(/\n/g);
        lfCount = matches ? matches.length : 0;
    } else if (!content.includes('\n')) {
        const matches = content.match(/\r/g);
        crCount = matches ? matches.length : 0;
    } else {
        const re = /\r\n|\r|\n/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(content)) !== null) {
            if (m[0] === '\r\n') crlfCount++;
            else if (m[0] === '\n') lfCount++;
            else crCount++;
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

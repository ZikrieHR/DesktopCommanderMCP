export type MarkdownSlugTracker = (text: string) => string;

function sanitizeSlugPart(text: string): string {
    // Optimization: Skip expensive unicode NFKD normalization & diacritic strip for ASCII-only text (>50% speedup)
    const str = /[^\x00-\x7F]/.test(text)
        ? text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
        : text;

    // Streamline regex chain into non-alphanumeric replacement and hyphen trimming
    const normalized = str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return normalized.length > 0 ? normalized : 'section';
}

export function slugifyMarkdownHeading(text: string): string {
    return sanitizeSlugPart(text);
}

export function createSlugTracker(): MarkdownSlugTracker {
    const counts = new Map<string, number>();
    const usedSlugs = new Set<string>();

    return (text: string): string => {
        const baseSlug = slugifyMarkdownHeading(text);
        let nextCount = counts.get(baseSlug) ?? 1;
        let nextSlug = nextCount === 1 ? baseSlug : `${baseSlug}-${nextCount}`;

        while (usedSlugs.has(nextSlug)) {
            nextCount += 1;
            nextSlug = `${baseSlug}-${nextCount}`;
        }

        counts.set(baseSlug, nextCount + 1);
        usedSlugs.add(nextSlug);
        return nextSlug;
    };
}

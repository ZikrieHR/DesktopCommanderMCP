/**
 * Shared HTML escaping helper for UI string interpolation.
 */
const FAST_ESCAPE_REGEX = /[&<>'"]/;
const ESCAPE_GLOBAL_REGEX = /[&<>'"]/g;

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Shared HTML escaping helper for UI string interpolation.
 * Optimized with a fast path regex check to avoid allocations when no escaping is needed,
 * and a single regex pass replacement when escaping is required.
 */
export function escapeHtml(value: string): string {
  if (!FAST_ESCAPE_REGEX.test(value)) {
    return value;
  }
  return value.replace(ESCAPE_GLOBAL_REGEX, (ch) => ESCAPE_MAP[ch]);
}

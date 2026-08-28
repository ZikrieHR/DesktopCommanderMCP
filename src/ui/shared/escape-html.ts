/**
 * Shared HTML escaping helper for UI string interpolation.
 */
const matchRegex = /[&<>"']/;
const replaceRegex = /[&<>"']/g;
const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Shared HTML escaping helper for UI string interpolation.
 * Optimized with a fast-path regex test for plain strings and a single-pass regex replacement map.
 */
export function escapeHtml(value: string): string {
  if (!matchRegex.test(value)) return value;
  return value.replace(replaceRegex, (ch) => htmlEscapes[ch]);
}

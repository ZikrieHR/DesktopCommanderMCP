/**
 * Shared HTML escaping helper for UI string interpolation.
 * Optimized single-pass escape function avoiding multiple regular expression passes.
 */
const MATCH_HTML_REGEXP = /[&<>"']/;

export function escapeHtml(value: string): string {
  const match = MATCH_HTML_REGEXP.exec(value);
  if (!match) {
    return value;
  }

  let html = '';
  let lastIndex = 0;
  let index = match.index;

  for (; index < value.length; index++) {
    let escape: string;
    switch (value.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += value.substring(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + value.substring(lastIndex, index) : html;
}

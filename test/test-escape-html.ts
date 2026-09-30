import assert from 'node:assert';
import { escapeHtml } from '../src/ui/shared/escape-html.js';

console.log('Testing escapeHtml...');

// Test 1: Clean string with no special characters
const cleanStr = 'Hello World 123 path/to/file.ts';
assert.strictEqual(escapeHtml(cleanStr), cleanStr, 'Clean string should remain unchanged');

// Test 2: Individual HTML entities
assert.strictEqual(escapeHtml('&'), '&amp;', 'Ampersand should be escaped');
assert.strictEqual(escapeHtml('<'), '&lt;', 'Less than should be escaped');
assert.strictEqual(escapeHtml('>'), '&gt;', 'Greater than should be escaped');
assert.strictEqual(escapeHtml('"'), '&quot;', 'Double quote should be escaped');
assert.strictEqual(escapeHtml("'"), '&#39;', 'Single quote should be escaped');

// Test 3: Mixed HTML content
const htmlStr = '<div class="test" id=\'1\'>Hello & Welcome</div>';
const expectedHtmlStr = '&lt;div class=&quot;test&quot; id=&#39;1&#39;&gt;Hello &amp; Welcome&lt;/div&gt;';
assert.strictEqual(escapeHtml(htmlStr), expectedHtmlStr, 'Mixed HTML string should be correctly escaped');

// Test 4: Empty string
assert.strictEqual(escapeHtml(''), '', 'Empty string should return empty string');

// Test 5: String starting or ending with special character
assert.strictEqual(escapeHtml('&start'), '&amp;start', 'String starting with special char');
assert.strictEqual(escapeHtml('end>'), 'end&gt;', 'String ending with special char');

// Test 6: Coercion of non-string values if passed
assert.strictEqual(escapeHtml(123 as any), '123', 'Numbers should be coerced');

console.log('✅ All escapeHtml tests passed!');

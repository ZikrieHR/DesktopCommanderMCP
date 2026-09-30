import assert from 'assert';
import { detectLineEnding, normalizeLineEndings, analyzeLineEndings } from '../dist/utils/lineEndingHandler.js';

console.log('=== Running lineEndingHandler Unit Tests ===\n');

// 1. detectLineEnding
console.log('Testing detectLineEnding...');
assert.strictEqual(detectLineEnding('line1\nline2'), '\n', 'LF detection');
assert.strictEqual(detectLineEnding('line1\r\nline2'), '\r\n', 'CRLF detection');
assert.strictEqual(detectLineEnding('line1\rline2'), '\r', 'CR detection');
assert.strictEqual(detectLineEnding('line1\r\nline2\nline3'), '\r\n', 'Mixed starting with CRLF');
assert.strictEqual(detectLineEnding('line1\nline2\r\nline3'), '\n', 'Mixed starting with LF');
const defaultStyle = process.platform === 'win32' ? '\r\n' : '\n';
assert.strictEqual(detectLineEnding('no newlines'), defaultStyle, 'No newlines default');
assert.strictEqual(detectLineEnding(''), defaultStyle, 'Empty string default');
console.log('✓ detectLineEnding tests passed');

// 2. normalizeLineEndings
console.log('\nTesting normalizeLineEndings...');
assert.strictEqual(normalizeLineEndings('a\nb\nc', '\n'), 'a\nb\nc', 'LF to LF');
assert.strictEqual(normalizeLineEndings('a\r\nb\r\nc', '\n'), 'a\nb\nc', 'CRLF to LF');
assert.strictEqual(normalizeLineEndings('a\rb\rc', '\n'), 'a\nb\nc', 'CR to LF');
assert.strictEqual(normalizeLineEndings('a\r\nb\rc\nd', '\n'), 'a\nb\nc\nd', 'Mixed to LF');

assert.strictEqual(normalizeLineEndings('a\nb\nc', '\r\n'), 'a\r\nb\r\nc', 'LF to CRLF');
assert.strictEqual(normalizeLineEndings('a\r\nb\r\nc', '\r\n'), 'a\r\nb\r\nc', 'CRLF to CRLF');
assert.strictEqual(normalizeLineEndings('a\rb\rc', '\r\n'), 'a\r\nb\r\nc', 'CR to CRLF');

assert.strictEqual(normalizeLineEndings('a\nb\nc', '\r'), 'a\rb\rc', 'LF to CR');
assert.strictEqual(normalizeLineEndings('a\r\nb\r\nc', '\r'), 'a\rb\rc', 'CRLF to CR');
assert.strictEqual(normalizeLineEndings('a\rb\rc', '\r'), 'a\rb\rc', 'CR to CR');
console.log('✓ normalizeLineEndings tests passed');

// 3. analyzeLineEndings
console.log('\nTesting analyzeLineEndings...');
assert.deepStrictEqual(
    analyzeLineEndings('line1\nline2\nline3'),
    { style: '\n', count: 2, hasMixed: false },
    'LF analysis'
);
assert.deepStrictEqual(
    analyzeLineEndings('line1\r\nline2\r\nline3'),
    { style: '\r\n', count: 2, hasMixed: false },
    'CRLF analysis'
);
assert.deepStrictEqual(
    analyzeLineEndings('line1\rline2\rline3'),
    { style: '\r', count: 2, hasMixed: false },
    'CR analysis'
);
assert.deepStrictEqual(
    analyzeLineEndings('line1\nline2\r\nline3\rline4'),
    { style: '\n', count: 3, hasMixed: true },
    'Mixed analysis'
);
assert.deepStrictEqual(
    analyzeLineEndings('no newlines'),
    { style: '\n', count: 0, hasMixed: false },
    'No newlines analysis'
);
assert.deepStrictEqual(
    analyzeLineEndings(''),
    { style: '\n', count: 0, hasMixed: false },
    'Empty string analysis'
);
console.log('✓ analyzeLineEndings tests passed');

console.log('\n✅ All lineEndingHandler unit tests passed!');

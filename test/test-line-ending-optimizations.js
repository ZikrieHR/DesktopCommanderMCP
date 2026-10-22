import assert from 'assert';
import { TextFileHandler } from '../dist/utils/files/text.js';
import { detectLineEnding, normalizeLineEndings } from '../dist/utils/lineEndingHandler.js';

console.log('Running test-line-ending-optimizations...');

// 1. Test countLines
assert.strictEqual(TextFileHandler.countLines(''), 0);
assert.strictEqual(TextFileHandler.countLines('hello'), 1);
assert.strictEqual(TextFileHandler.countLines('hello\n'), 1);
assert.strictEqual(TextFileHandler.countLines('hello\nworld'), 2);
assert.strictEqual(TextFileHandler.countLines('hello\nworld\n'), 2);
assert.strictEqual(TextFileHandler.countLines('a\nb\nc\n'), 3);
assert.strictEqual(TextFileHandler.countLines('a\nb\nc'), 3);
console.log('✓ TextFileHandler.countLines passed');

// 2. Test splitLinesPreservingEndings
assert.deepStrictEqual(TextFileHandler.splitLinesPreservingEndings(''), ['']);
assert.deepStrictEqual(TextFileHandler.splitLinesPreservingEndings('hello'), ['hello']);
assert.deepStrictEqual(TextFileHandler.splitLinesPreservingEndings('hello\nworld\n'), ['hello\n', 'world\n']);
assert.deepStrictEqual(TextFileHandler.splitLinesPreservingEndings('hello\r\nworld'), ['hello\r\n', 'world']);
assert.deepStrictEqual(TextFileHandler.splitLinesPreservingEndings('hello\rworld'), ['hello\r', 'world']);
assert.deepStrictEqual(TextFileHandler.splitLinesPreservingEndings('line1\nline2\r\nline3\rline4'), ['line1\n', 'line2\r\n', 'line3\r', 'line4']);
console.log('✓ TextFileHandler.splitLinesPreservingEndings passed');

// 3. Test detectLineEnding
assert.strictEqual(detectLineEnding('hello\nworld'), '\n');
assert.strictEqual(detectLineEnding('hello\r\nworld'), '\r\n');
assert.strictEqual(detectLineEnding('hello\rworld'), '\r');
console.log('✓ detectLineEnding passed');

// 4. Test normalizeLineEndings
assert.strictEqual(normalizeLineEndings('hello\nworld', '\n'), 'hello\nworld');
assert.strictEqual(normalizeLineEndings('hello\r\nworld', '\n'), 'hello\nworld');
assert.strictEqual(normalizeLineEndings('hello\rworld', '\n'), 'hello\nworld');
assert.strictEqual(normalizeLineEndings('hello\nworld', '\r\n'), 'hello\r\nworld');
assert.strictEqual(normalizeLineEndings('hello\nworld', '\r'), 'hello\rworld');
console.log('✓ normalizeLineEndings passed');

console.log('All line ending optimization tests passed successfully!');

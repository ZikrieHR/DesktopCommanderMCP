import assert from 'assert';
import { TextFileHandler } from '../dist/utils/files/text.js';
import { normalizeLineEndings } from '../dist/utils/lineEndingHandler.js';

console.log('=== Bolt Line Optimization Unit & Benchmark Tests ===\n');

// 1. Correctness tests for countLines
assert.strictEqual(TextFileHandler.countLines(''), 0, 'Empty string should be 0 lines');
assert.strictEqual(TextFileHandler.countLines('hello'), 1, 'Single line without newline');
assert.strictEqual(TextFileHandler.countLines('hello\n'), 1, 'Single line with trailing newline');
assert.strictEqual(TextFileHandler.countLines('hello\r\n'), 1, 'Single line with trailing CRLF');
assert.strictEqual(TextFileHandler.countLines('a\nb\nc'), 3, '3 lines without trailing newline');
assert.strictEqual(TextFileHandler.countLines('a\nb\nc\n'), 3, '3 lines with trailing newline');
assert.strictEqual(TextFileHandler.countLines('\n'), 1, 'Single empty line ending in newline');
assert.strictEqual(TextFileHandler.countLines('\n\n'), 2, 'Two empty lines ending in newline');

console.log('✅ countLines correctness tests passed!');

// 2. Correctness tests for normalizeLineEndings
assert.strictEqual(normalizeLineEndings('a\r\nb', '\n'), 'a\nb');
assert.strictEqual(normalizeLineEndings('a\nb', '\n'), 'a\nb');
assert.strictEqual(normalizeLineEndings('a\nb', '\r\n'), 'a\r\nb');
assert.strictEqual(normalizeLineEndings('a\r\nb', '\r\n'), 'a\r\nb');
assert.strictEqual(normalizeLineEndings('a\rb', '\n'), 'a\nb');

console.log('✅ normalizeLineEndings correctness tests passed!');

// 3. Benchmark countLines
const lineCount = 100000;
const largeContent = Array.from({ length: lineCount }, (_, i) => `This is line number ${i} with sample content.`).join('\n') + '\n';

const iterations = 10;
const startTime = performance.now();
for (let i = 0; i < iterations; i++) {
    const lines = TextFileHandler.countLines(largeContent);
    assert.strictEqual(lines, lineCount);
}
const elapsed = performance.now() - startTime;
console.log(`⚡ Benchmark countLines: ${iterations} runs on 100,000 lines took ${elapsed.toFixed(2)}ms (${(elapsed / iterations).toFixed(2)}ms / run)`);

console.log('\n🎉 All Bolt optimization tests passed successfully!');

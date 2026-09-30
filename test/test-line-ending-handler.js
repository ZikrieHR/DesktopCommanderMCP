import assert from 'assert';
import { detectLineEnding, normalizeLineEndings, analyzeLineEndings } from '../dist/utils/lineEndingHandler.js';

console.log('=== Line Ending Handler Performance & Correctness Tests ===\n');

// 1. detectLineEnding tests
console.log('1. Testing detectLineEnding...');
assert.strictEqual(detectLineEnding('line1\nline2\nline3'), '\n');
assert.strictEqual(detectLineEnding('line1\r\nline2\r\nline3'), '\r\n');
assert.strictEqual(detectLineEnding('line1\rline2\rline3'), '\r');

// Edge cases
const systemDefault = process.platform === 'win32' ? '\r\n' : '\n';
assert.strictEqual(detectLineEnding('no line endings'), systemDefault);
assert.strictEqual(detectLineEnding(''), systemDefault);

// Boundary test: \r at position 8191 and \n at position 8192
const boundaryCRLF = 'a'.repeat(8191) + '\r\nline2';
assert.strictEqual(detectLineEnding(boundaryCRLF), '\r\n');

// Boundary test: \r at position 8191 and text continues without \n
const boundaryCR = 'a'.repeat(8191) + '\rline2';
assert.strictEqual(detectLineEnding(boundaryCR), '\r');

// Large file beyond 8KB with LF
const largeLF = 'a'.repeat(10000) + '\nline2';
assert.strictEqual(detectLineEnding(largeLF), '\n');

console.log('  ✓ detectLineEnding tests passed');

// 2. normalizeLineEndings tests
console.log('\n2. Testing normalizeLineEndings...');
const testInputs = [
    'line1\nline2\nline3',
    'line1\r\nline2\r\nline3',
    'line1\rline2\rline3',
    'line1\r\nline2\nline3\rline4',
    'single line with no break'
];

for (const input of testInputs) {
    // To LF
    const toLF = normalizeLineEndings(input, '\n');
    assert.ok(!toLF.includes('\r'), `Should contain no CR: ${JSON.stringify(toLF)}`);
    if (input.includes('\n') || input.includes('\r')) {
        assert.strictEqual(toLF, 'line1\nline2\nline3' + (input.includes('line4') ? '\nline4' : ''));
    }

    // To CRLF
    const toCRLF = normalizeLineEndings(input, '\r\n');
    if (input.includes('\n') || input.includes('\r')) {
        assert.ok(toCRLF.includes('\r\n'), `Should contain CRLF: ${JSON.stringify(toCRLF)}`);
        assert.ok(!toCRLF.replace(/\r\n/g, '').includes('\r'), 'Should contain no standalone CR');
        assert.ok(!toCRLF.replace(/\r\n/g, '').includes('\n'), 'Should contain no standalone LF');
    }

    // To CR
    const toCR = normalizeLineEndings(input, '\r');
    assert.ok(!toCR.includes('\n'), `Should contain no LF: ${JSON.stringify(toCR)}`);
}

// Optimization check: unchanged reference for already-normalized LF text
const cleanLF = 'a\nb\nc';
assert.strictEqual(normalizeLineEndings(cleanLF, '\n'), cleanLF, 'Should return exact same string reference when no change needed');

console.log('  ✓ normalizeLineEndings tests passed');

// 3. analyzeLineEndings tests
console.log('\n3. Testing analyzeLineEndings...');
const pureLF = analyzeLineEndings('line1\nline2\nline3');
assert.deepStrictEqual(pureLF, { style: '\n', count: 2, hasMixed: false });

const pureCRLF = analyzeLineEndings('line1\r\nline2\r\nline3');
assert.deepStrictEqual(pureCRLF, { style: '\r\n', count: 2, hasMixed: false });

const pureCR = analyzeLineEndings('line1\rline2\rline3');
assert.deepStrictEqual(pureCR, { style: '\r', count: 2, hasMixed: false });

const mixed = analyzeLineEndings('line1\r\nline2\nline3\rline4');
assert.strictEqual(mixed.count, 3);
assert.strictEqual(mixed.hasMixed, true);

const empty = analyzeLineEndings('no newlines');
assert.strictEqual(empty.count, 0);
assert.strictEqual(empty.hasMixed, false);

console.log('  ✓ analyzeLineEndings tests passed');

console.log('\n✅ All line ending handler tests passed!');

import { TextFileHandler } from '../dist/utils/files/text.js';

console.log('Testing TextFileHandler.splitLinesPreservingEndings...');

const testCases = [
    { input: '', expected: [''] },
    { input: 'hello', expected: ['hello'] },
    { input: 'hello\n', expected: ['hello\n'] },
    { input: 'hello\r\n', expected: ['hello\r\n'] },
    { input: 'hello\r', expected: ['hello\r'] },
    { input: 'line1\nline2\n', expected: ['line1\n', 'line2\n'] },
    { input: 'line1\r\nline2\r\n', expected: ['line1\r\n', 'line2\r\n'] },
    { input: 'line1\rline2\r', expected: ['line1\r', 'line2\r'] },
    { input: 'line1\nline2', expected: ['line1\n', 'line2'] },
    { input: 'line1\r\nline2', expected: ['line1\r\n', 'line2'] },
    { input: 'line1\rline2', expected: ['line1\r', 'line2'] },
    { input: 'mixed\r\nlines\nhere\rand now', expected: ['mixed\r\n', 'lines\n', 'here\r', 'and now'] },
    { input: '\n\r\n\r', expected: ['\n', '\r\n', '\r'] },
];

let failed = 0;
for (const tc of testCases) {
    const result = TextFileHandler.splitLinesPreservingEndings(tc.input);
    const pass = JSON.stringify(result) === JSON.stringify(tc.expected);
    if (!pass) {
        console.error(`❌ FAIL: input=${JSON.stringify(tc.input)}`);
        console.error(`  Expected: ${JSON.stringify(tc.expected)}`);
        console.error(`  Received: ${JSON.stringify(result)}`);
        failed++;
    } else {
        console.log(`  ✅ PASS: input=${JSON.stringify(tc.input)} -> ${JSON.stringify(result)}`);
    }
}

if (failed > 0) {
    console.error(`\n${failed} test(s) failed.`);
    process.exit(1);
} else {
    console.log(`\nAll ${testCases.length} tests passed successfully.`);
}

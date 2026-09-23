#!/usr/bin/env node
/**
 * Test: Verify escapeHtml functionality and edge cases
 */

import assert from 'assert';
import { escapeHtml } from '../dist/ui/shared/escape-html.js';

function runEscapeHtmlTests() {
  console.log('\n=== Test: escapeHtml Performance & Correctness ===\n');

  // Test 1: Clean strings without HTML special characters
  assert.strictEqual(escapeHtml('hello world'), 'hello world');
  assert.strictEqual(escapeHtml('path/to/file.ts'), 'path/to/file.ts');
  assert.strictEqual(escapeHtml('1234567890'), '1234567890');
  console.log('   ✅ PASS: Clean strings pass through unmodified');

  // Test 2: Strings with individual special HTML characters
  assert.strictEqual(escapeHtml('A & B'), 'A &amp; B');
  assert.strictEqual(escapeHtml('<script>'), '&lt;script&gt;');
  assert.strictEqual(escapeHtml('"quoted"'), '&quot;quoted&quot;');
  assert.strictEqual(escapeHtml("it's"), 'it&#39;s');
  console.log('   ✅ PASS: Individual special characters escaped correctly');

  // Test 3: Complex string with multiple special characters
  const input = '<div class="test" data-info=\'cool\'>R&D</div>';
  const expected = '&lt;div class=&quot;test&quot; data-info=&#39;cool&#39;&gt;R&amp;D&lt;/div&gt;';
  assert.strictEqual(escapeHtml(input), expected);
  console.log('   ✅ PASS: Complex HTML strings escaped correctly');

  // Test 4: Edge cases (empty string, falsy values)
  assert.strictEqual(escapeHtml(''), '');
  assert.strictEqual(escapeHtml(null), '');
  assert.strictEqual(escapeHtml(undefined), '');
  console.log('   ✅ PASS: Empty and falsy values handled gracefully');

  console.log('\n=== All escapeHtml Tests Passed! ===\n');
}

runEscapeHtmlTests();

import tap from 'tap'
const { test } = tap;
import { ASMCompiler } from '../AST/ASMCompiler.js';
import { Compiler } from '../ASM/Compiler.js';
import { CodeBlock } from '../AST/CodeBlock.js';

test('Check Compiler checker v1', (t) => {
  const chomp = CodeBlock.chomp('{int adafg=3+4;int c=5+6;c=adafg*5;}', 0)
  let program = new Compiler(null);
  let block = program.compileBlock(chomp);
  console.log(block.toString())

  t.end();
});
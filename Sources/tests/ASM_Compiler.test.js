import tap from 'tap'
const { test } = tap;
import { ASMCompiler } from '../AST/ASMCompiler.js';
import { Compiler } from '../ASM/Compiler.js';
import { Initialization } from '../AST/Initialization.js';

test('Check Compiler checker v1', (t) => {
  const chomp = Initialization.chomp('int adafg=3+4;', 0)
  let program = new Compiler(null);
  let block = program.compileBlock(chomp);
  console.log(block.toString())

  t.end();
});
import tap from 'tap'
const { test } = tap;
import { Compiler } from '../ASM/Compiler.js';
import { CodeBlock } from '../AST/CodeBlock.js';
import { Program } from '../AST/Program.js';

test('Check Compiler checker v1', (t) => {
  const chomp = CodeBlock.chomp('{int adafg=3+4;int c=5+6;c=adafg*5;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);
  t.equal(asmBlock.toStringArray().toString(), [
    'MOV $0 3',       'MOV $1 4',
    'ADD $2 $0 $1',   'PUSH $2',
    'MOV $0 5',       'MOV $1 6',
    'ADD $2 $0 $1',   'PUSH $2',
    'MOV $0 [$st-8]', 'MOV $1 5',
    'MUL $2 $0 $1',   'MOV [$st-4] $2',
    'POP 8'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v2', (t) => {
  const chomp = CodeBlock.chomp('{int a=3+4;int c=(a*a)+2;int b=c+a;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);
  t.equal(asmBlock.toStringArray().toString(), [
    'MOV $0 3',       'MOV $1 4',
    'ADD $2 $0 $1',   'PUSH $2',
    'MOV $0 [$st-4]', 'MOV $1 [$st-4]',
    'MUL $2 $0 $1',   'MOV $0 2',
    'ADD $1 $2 $0',   'PUSH $1',
    'MOV $0 [$st-4]', 'MOV $1 [$st-8]',
    'ADD $2 $0 $1',   'PUSH $2',
    'POP 12'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v3', (t) => {
  const chomp = CodeBlock.chomp('{int a=1+1;{int b=a+5;}int c=a;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);
  t.equal(asmBlock.toStringArray().toString(),[
    'MOV $0 1',       'MOV $1 1',
    'ADD $2 $0 $1',   'PUSH $2',
    'MOV $0 [$st-4]', 'MOV $1 5',
    'ADD $2 $0 $1',   'PUSH $2',
    'POP 4',          'MOV $0 [$st-4]',
    'PUSH $0',        'POP 8'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v4', (t) => {
  const chomp = CodeBlock.chomp('{int a=1+1;{int b=a+5;int c=10+b;}int c=a;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);
  t.equal(asmBlock.toStringArray().toString(),[
    'MOV $0 1',       'MOV $1 1',
    'ADD $2 $0 $1',   'PUSH $2',
    'MOV $0 [$st-4]', 'MOV $1 5',
    'ADD $2 $0 $1',   'PUSH $2',
    'MOV $0 10',      'MOV $1 [$st-4]',
    'ADD $2 $0 $1',   'PUSH $2',
    'POP 8',          'MOV $0 [$st-4]',
    'PUSH $0',        'POP 8'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v5', (t) => {
  const chomp = CodeBlock.chomp('{int a=1==4;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);

  t.equal(asmBlock.toStringArray().toString(),[ 'MOV $0 1', 'MOV $1 4', 'CMP $0 $1', 'SETE $2', 'PUSH $2', 'POP 4' ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v6', (t) => {
  const chomp = CodeBlock.chomp('{int a=1<4;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);

  t.equal(asmBlock.toStringArray().toString(),[
    'MOV $0 1',
    'MOV $1 4',
    'CMP $0 $1',
    'MOV $2 $CF',
    'PUSH $2',
    'POP 4'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v7', (t) => {
  const chomp = CodeBlock.chomp('{int a=1>4;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);

  t.equal(asmBlock.toStringArray().toString(),[
    'MOV $0 1',
    'MOV $1 4',
    'CMP $0 $1',
    'MOV $2 $CT',
    'PUSH $2',
    'POP 4'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v8', (t) => {
  const chomp = CodeBlock.chomp('{int a=1!=4;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);

  t.equal(asmBlock.toStringArray().toString(),[ 'MOV $0 1', 'MOV $1 4', 'CMP $0 $1', 'SETNE $2', 'PUSH $2', 'POP 4' ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v9', (t) => {
  const chomp = CodeBlock.chomp('{int a=2+4>=4+2;}', 0)
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);

  t.equal(asmBlock.toStringArray().toString(),[
    'MOV $0 2',
    'MOV $1 4',
    'ADD $2 $0 $1',
    'MOV $0 4',
    'MOV $1 2',
    'ADD $3 $0 $1',
    'CMP $2 $3',
    'SETGE $0',
    'PUSH $0',
    'POP 4'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v11 (Fibbo variable).', (t) => {
  const chomp = CodeBlock.chomp('{int a=0,b=1,n=10,i=0,result=0;while(i<n){int c=a+b;a=b;b=c;i=i+1;}result=b;}', 0) // bug
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);
  // console.log(asmBlock.toStringArray());

  t.equal(asmBlock.toStringArray().toString(),[
    'MOV $0 0',        'PUSH $0',         'MOV $0 1',
    'PUSH $0',         'MOV $0 10',       'PUSH $0',
    'MOV $0 0',        'PUSH $0',         'MOV $0 0',
    'PUSH $0',         ':_label0',        'MOV $0 [$st-8]',
    'MOV $1 [$st-12]', 'CMP $0 $1',       'MOV $2 $CF',
    'TEST $2 $2',      'JZ _label1',      'MOV $0 [$st-20]',
    'MOV $1 [$st-16]', 'ADD $3 $0 $1',    'PUSH $3',
    'MOV $0 [$st-20]', 'MOV [$st-24] $0', 'MOV $0 [$st-4]',
    'MOV [$st-20] $0', 'MOV $0 [$st-12]', 'MOV $1 1',
    'ADD $3 $0 $1',    'MOV [$st-12] $3', 'POP 4',
    'JMP _label0',     ':_label1',        'MOV $0 [$st-16]',
    'MOV [$st-4] $0',  'POP 20'
  ].toString(), 'returns');

  t.end();
});

test('Check Compiler checker v11 (Reverse a number).', (t) => {
  const chomp = CodeBlock.chomp('{int a=123,b=0;while(a!=0){b=b*10;b=b+a%10;a=a/10;}}', 0) // bug
  let program = new Compiler(null);
  let asmBlock = program.compileBlock(chomp);

  t.equal(asmBlock.toStringArray().toString(),[
    'MOV $0 123',     'PUSH $0',
    'MOV $0 0',       'PUSH $0',
    ':_label0',       'MOV $0 [$st-8]',
    'MOV $1 0',       'CMP $0 $1',
    'SETNE $2',       'TEST $2 $2',
    'JZ _label1',     'MOV $0 [$st-4]',
    'MOV $1 10',      'MUL $3 $0 $1',
    'MOV [$st-4] $3', 'MOV $0 [$st-8]',
    'MOV $1 10',      'DIV $0 $1',
    'MOV $3 $LO',     'MOV $0 [$st-4]',
    'ADD $1 $0 $3',   'MOV [$st-4] $1',
    'MOV $0 [$st-8]', 'MOV $1 10',
    'DIV $0 $1',      'MOV $3 $HI',
    'MOV [$st-8] $3', 'JMP _label0',
    ':_label1',       'POP 8'
  ].toString(), 'returns');

  t.end();
});

// test('Check Compiler checker v12 (Full Program).', (t) => {
//   const program = new Program('int cocoJambo(int b,int c){int d=b+c;return d+1;}int main(){int frt=11;int b=17+cocoJambo(3,4);return 0;}') // bug
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   // console.log(asmBlock.toString())

//   // t.equal(asmBlock.toStringArray().toString(),[
//   //   'MOV $0 123',     'PUSH $0',
//   //   'MOV $0 0',       'PUSH $0',
//   //   ':_label0',       'MOV $0 [$st-8]',
//   //   'MOV $1 0',       'CMP $0 $1',
//   //   'SETNE $2',       'TEST $2 $2',
//   //   'JZ _label1',     'MOV $0 [$st-4]',
//   //   'MOV $1 10',      'MUL $3 $0 $1',
//   //   'MOV [$st-4] $3', 'MOV $0 [$st-8]',
//   //   'MOV $1 10',      'DIV $0 $1',
//   //   'MOV $3 $LO',     'MOV $0 [$st-4]',
//   //   'ADD $1 $0 $3',   'MOV [$st-4] $1',
//   //   'MOV $0 [$st-8]', 'MOV $1 10',
//   //   'DIV $0 $1',      'MOV $3 $HI',
//   //   'MOV [$st-8] $3', 'JMP _label0',
//   //   ':_label1',       'POP 8'
//   // ].toString(), 'returns');

//   t.end();
// });

// test('Check Compiler checker v13 (Full Program).', (t) => {
//   const program = new Program('int fibboRecursive(int n){while(n<2){return 0;}return fibboRecursive(n-1)+1;}int main(){int b=fibboRecursive(5);return 0;}')
//   let chomp = program.chomp();
//   t.equal(chomp.isInvalid(), false, 'returns');
//   let programCompiler = new Compiler(null);
//   let asmBlock = programCompiler.compileProgram(chomp);
//   asmBlock.run()

//   t.end();
// });
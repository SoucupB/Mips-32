import tap from 'tap'
const { test } = tap;
import { Compiler } from '../ASM/Compiler.js';
import { Program } from '../AST/Program.js';
import { Print, PrintTypes } from '../ASM/Register.js';

test('Check Compiler recursive fibbo.', (t) => { 
  const program = new Program('int fibboRecursive(int n){if(n<2){return 1;}return fibboRecursive(n-1)+fibboRecursive(n-2);}void main(){int b=fibboRecursive(8);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '34', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Check Compiler add 2 numbers.', (t) => {
  const program = new Program('int add(int a,int b){return a+b;}void main(){int b=add(5,7);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '12', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Check Compiler add 4 numbers.', (t) => {
  const program = new Program('int add(int a,int b,int c,int d){return a+b+c+d;}void main(){int b=add(1,2,3,4);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '10', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Check Compiler mirror.', (t) => {
  const program = new Program('int mirror(int a){int response=0;while(a!=0){response=response*10;response=response+a%10;a=a/10;}return response;}void main(){int b=mirror(123);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run();
  // console.log(asmBlock.toString())
  // console.log(asmBlock.runner.printPointerBytes(32))
  t.equal(asmBlock.getOutputBuffer(), '321', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Send by value', (t) => {
  const program = new Program('int reff(int a){a=10;return 15;}void main(){int a=5;int b=reff(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY));
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '5', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Multiple declarations inside a method v1', (t) => {
  const program = new Program('int reff(int a){int c=3;return a+c;}void main(){int a=5;int b=reff(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('4', PrintTypes.MEMORY));
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '8', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Multiple declarations inside a method v2', (t) => {
  const program = new Program('int reff(int a){int c=3,v=5,t=7;if(v==5){int z=3;c=c+10+z;}return a+c+t;}void main(){int a=5;int b=reff(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('4', PrintTypes.MEMORY));
  asmBlock.run();
  t.equal(asmBlock.getOutputBuffer(), '28', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Chain calls', (t) => {
  const program = new Program('int testA(int z){return z+10;}int reff(int a){int c=3,v=5,t=7;if(v==5){int z=3;c=c+10+z;}return (a+c+t)*testA(10)+testA(5);}void main(){int a=5;int b=reff(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('4', PrintTypes.MEMORY));
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '575', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('least common divisor v1', (t) => {
  const program = new Program('int cmmdc(int a,int b){if(b==0){return a;}return cmmdc(b,a%b);}void main(){int a=cmmdc(12,16);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY));
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '4', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('least common divisor v2', (t) => {
  const program = new Program('int cmmdc(int a,int b){if(b==0){return a;}return cmmdc(b,a%b);}void main(){int a=cmmdc(28,35),z=0;z=printLine(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run()
  t.equal(asmBlock.getStdoutResponse(), '7', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('least common divisor v3', (t) => {
  const program = new Program('int cmmdc(int a,int b){if(b==0){return a;}return cmmdc(b,a%b);}void main(){int a=cmmdc(3556,8382),z=0;z=printLine(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run()
  t.equal(asmBlock.getStdoutResponse(), '254', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive calls, power v1', (t) => {
  const program = new Program('int power(int p,int e){if(e==0){return 1;}if(e%2!=0){return p*power(p,e-1);}int response=power(p,e/2);return response*response;}void main(){int a=power(2,4);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY));
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '16', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive calls, power v2', (t) => {
  const program = new Program('int power(int p,int e){if(e==0){return 1;}if(e%2!=0){return p*power(p,e-1);}int response=power(p,e/2);return response*response;}void main(){int a=power(7,6);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY));
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '117649', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive calls, power v3', (t) => {
  const program = new Program('int power(int p,int e){if(e==0){return 1;}if(e%2!=0){return p*power(p,e-1);}int response=power(p,e/2);return response*response;}void main(){int a=power(9,5);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY));
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '59049', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive factorial v1', (t) => {
  const program = new Program('int factorial(int p){if(p<1){return 1;}return p*factorial(p-1);}void main(){int a=factorial(5);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '120', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive factorial v2', (t) => {
  const program = new Program('int factorial(int p){if(p<1){return 1;}return p*factorial(p-1);}void main(){int a=factorial(7);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '5040', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Non-Recursive factorial v2', (t) => {
  const program = new Program('int factorial(int p){int z=1;for(int i=1;i<=p;i=i+1){z=z*i;}return z;}void main(){int a=factorial(7);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '5040', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Negative numbers', (t) => {
  const program = new Program('void main(){int a=10-53;}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '-43', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Check Compiler recursive fibbonachi with negative.', (t) => { 
  const program = new Program('int fibboRecursive(int n){if(n<0){return 1;}return fibboRecursive(n-1)+fibboRecursive(n-2);}void main(){int b=fibboRecursive(8);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '89', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive pyramide building v1', (t) => { 
  const program = new Program('int pyramid(int a,int b){if(a==0||b==0){return 1;}return pyramid(a-1,b)+pyramid(a,b-1);}void main(){int b=pyramid(6,3);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '84', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive pyramide building v2', (t) => { 
  const program = new Program('int pyramid(int a,int b){if(a==0||b==0){return 1;}return pyramid(a-1,b)+pyramid(a,b-1);}void main(){int b=pyramid(7,9);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '11440', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive pyramide building v3', (t) => { 
  const program = new Program('int pyramid(int a,int b){if(a==0||b==0){return 1;}return pyramid(a-1,b)+pyramid(a,b-1);}void main(){int b=pyramid(3,8);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '165', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer program v1', (t) => { 
  const program = new Program('void main(){int a=15;int b=343;a=a+*(b+100)+43;}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '58', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer program v2', (t) => { 
  const program = new Program('void main(){int a=15;int b=344;*b=100+100;a=*b+a;}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '215', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer program v2', (t) => { 
  const program = new Program('void main(){int buffer=344,z=setElement(buffer,0,134),c=*buffer;}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('8', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '134', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer program v3', (t) => { 
  const program = new Program('void main(){int sum=0,buffer=344,trp=0;for(int i=1;i<=100;i=i+1){setElement(buffer,i,i);}for(int i=1;i<=100;i=i+1){sum=sum+getElement(buffer,i);}}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.push(new Print('0', PrintTypes.MEMORY))
  asmBlock.run()
  t.equal(asmBlock.getOutputBuffer(), '5050', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

// MOV [$3] $0
// MOV $0 [$st-4]
// MOV $1 4
// ADD $2 $0 $1
// PUSH $2
// POP 4
// MOV $0 [$st-8]
// MOV $1 4
// SUB $2 $0 $1
// PUSH $2
// POP 4
// MOV [$2] $2

// Fix a bug where registers from an expression are intechangably used with the pointer registers.
test('Pointer program v4', (t) => { 
  const program = new Program('void main(){int sum=112;printLine(sum);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '112', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer program v5', (t) => {
  const program = new Program('void main(){int sum=112;printLine(sum);printLine(sum+100);printLine(sum+200);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '112\n212\n312', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer program v6', (t) => {
  const program = new Program('void main(){int buffer=3242;for(int i=0;i<=5;i=i+1){setElement(buffer,i,i+100);}for(int i=0;i<=5;i=i+1){printLine(getElement(buffer,i));}}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '100\n101\n102\n103\n104\n105', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Recursive calls, power with modulo', (t) => {
  const program = new Program('int power(int p,int e){if(e==0){return 1;}if(e%2!=0){return (p*power(p,e-1))%43254;}int response=power(p,e/2);return (response*response)%43254;}void main(){int a=power(2,1000000000);printLine(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '5830', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Expression lines v1', (t) => {
  const program = new Program('void main(){int a=8,b=3;a+b-3+5;printLine(a);printLine(b);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '8\n3', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Expression lines v2', (t) => {
  const program = new Program('void main(){int a=3*(4+4)*5;printLine(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  console.log(asmBlock.toString())
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '120', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});
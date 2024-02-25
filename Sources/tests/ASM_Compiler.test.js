import tap from 'tap'
const { test } = tap;
import { Compiler } from '../ASM/Compiler.js';
import { Program } from '../AST/Program.js';
import { Print, PrintTypes } from '../ASM/Register.js';

test('Check Compiler recursive fibbo.', (t) => { 
  const program = new Program(`
    int fibboRecursive(int n) {
      if ( n < 2 ) {
        return 1;
      }
      return fibboRecursive ( n - 1 ) + fibboRecursive ( n - 2 );
    }
    void main() {
      printLine(fibboRecursive(8));
    }`
  )
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run()
  t.equal(asmBlock.getStdoutResponse(), '34', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Check Compiler add 2 numbers.', (t) => {
  const program = new Program(`
    int add(int a, int b) {
      return a + b;
    }
    void main() {
      int b = add(5, 7);
      printLine(b);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run()
  t.equal(asmBlock.getStdoutResponse(), '12', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Check Compiler add 4 numbers.', (t) => {
  const program = new Program(`
    int add ( int a, int b, int c, int d)
    {
      return a + b + c + d;
    }
    void main() {
      int b = add(1, 2, 3, 4);
      printLine(b);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run()
  t.equal(asmBlock.getStdoutResponse(), '10', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Check Compiler mirror.', (t) => {
  const program = new Program(`
    int mirror(int a) {
      int response=0;
      while(a != 0) {
        response = response * 10;
        response = response + a % 10;
        a = a / 10;
      }
      return response;
    }
    void main() {
      int b = mirror(123);
      printLine(b);
    }
    `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '321', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Send by value', (t) => {
  const program = new Program(`
    int reff(int a) {
      a = 10;
      return 15;
    }
    void main() {
      int a = 5;
      int b = reff(a);
      printLine(a);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '5', 'returns');
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
  const program = new Program('void main(){int a=10-53;printLine(a);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run()
  t.equal(asmBlock.getStdoutResponse(), '-43', 'returns');
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
  const program = new Program('void main(){int buffer=344,z=setElement(buffer,0,134),c=*buffer;printLine(c);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run()
  t.equal(asmBlock.getStdoutResponse(), '134', 'returns');
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
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '120', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer arithmetics v1', (t) => {
  const program = new Program('void main(){int a=5,b=1000,c=0;*(b+30)=15+16+17+a;c=*(b+30);printLine(c);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '53', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer arithmetics v2', (t) => {
  const program = new Program('void main(){int a=5,b=1000;*(b+30)=15+16+17+a;int c=*(b+30);printLine(c);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '53', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer arithmetics v3', (t) => {
  const program = new Program(`
    void main() {
      int a = 5, b = 1000, z = 1500; 
      *(z + 64) = 22;
      *(b + 30) = 15 + 16 + 17 + a;
      int c = *(b + 30) + *(z + 64);
      printLine(c);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '75', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

// make it only use 3 registers by ordering the operations
test('Pointer arithmetics v4', (t) => {
  const program = new Program('void main(){int a=5,b=1000,z=1500;*(b+30)=15;*(z+64)=22;*(b+30+*(z+64))=15+16+17+a;int c=*(b+30)+*(b+30+*(z+64));printLine(c);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '68', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer arithmetics v4', (t) => {
  const program = new Program('void main(){int a=5,b=1000,z=1500;*(b+30)=15;*(z+64)=22;*(b+30+*(z+64))=15+16+(17+a)**(z+64);int c=*(b+30)+*(b+30+*(z+64));printLine(c);}')
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '530', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer swapping 2 values', (t) => {
  const program = new Program(`
    int swap(int pA, int pB) {
      int aux = *pA;
      *pA = *pB;
      *pB = aux;

      return 0;
    }

    void main() {
      int a = 1050, b = 1060;
      *a = 15;
      *b = 43;
      printLine(*a);
      printLine(*b);
      swap(a, b);
      printLine(*a);
      printLine(*b);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '15\n43\n43\n15', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer permutations v1', (t) => {
  const program = new Program(`
    int permutations(int n, int k, int total, int checker) {
      if(k >= n) {
        *total = *total + 1;
        return 0;
      }

      for(int i = 1; i <= n; i = i + 1) {
        if(getElement(checker, i) == 0) {
          setElement(checker, i, 1);
          permutations(n, k + 1, total, checker);
          setElement(checker, i, 0);
        }
      }

      return 0;
    }

    void main() {
      int buffer = 1050, n = 5, total = 1100, checker = 2000;
      permutations(n, 0, total, checker);
      printLine(*total);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '120', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer permutations v3', (t) => {
  const program = new Program(`
    int permutations(int n, int k, int displayBuffer, int checker) {
      if(k >= n) {
        for(int i = 0; i < n; i = i + 1) {
          printLine(getElement(displayBuffer, i));
        }
        return 0;
      }

      for(int i = 1; i <= n; i = i + 1) {
        if(getElement(checker, i) == 0) {
          setElement(checker, i, 1);
          setElement(displayBuffer, k, i);
          permutations(n, k + 1, displayBuffer, checker);
          setElement(checker, i, 0);
        }
      }

      return 0;
    }

    void main() {
      int buffer = 1050, n = 2, checker = 2000;
      int responseBuffer = 504;
      permutations(n, 0, responseBuffer, checker);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '1\n2\n2\n1', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer permutations v4', (t) => {
  const program = new Program(`
    int permutations(int n, int k, int displayBuffer, int checker) {
      if(k >= n) {
        for(int i = 0; i < n; i = i + 1) {
          printLine(getElement(displayBuffer, i));
        }
        return 0;
      }

      for(int i = 1; i <= n; i = i + 1) {
        if(getElement(checker, i) == 0) {
          setElement(checker, i, 1);
          setElement(displayBuffer, k, i);
          permutations(n, k + 1, displayBuffer, checker);
          setElement(checker, i, 0);
        }
      }

      return 0;
    }

    void main() {
      int buffer = 1050, n = 3, checker = 2000;
      int responseBuffer = 504;
      permutations(n, 0, responseBuffer, checker);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), [
    1, 2, 3, 
    1, 3, 2, 
    2, 1, 3, 
    2, 3, 1, 
    3, 1, 2, 
    3, 2, 1
  ].join('\n'), 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer permutations v2', (t) => {
  const program = new Program(`
    int permutations(int n, int k, int total, int checker) {
      if(k >= n) {
        *total = *total + 1;
        return 0;
      }

      for(int i = 1; i <= n; i = i + 1) {
        if(getElement(checker, i) == 0) {
          setElement(checker, i, 1);
          permutations(n, k + 1, total, checker);
          setElement(checker, i, 0);
        }
      }

      return 0;
    }

    void main() {
      int n = 7, total = 5100, checker = 3000;
      permutations(n, 0, total, checker);
      printLine(*total);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '5040', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer permutations v3', (t) => {
  const program = new Program(`
    int permutations(int n, int k, int total, int checker) {
      if(k >= n) {
        *total = *total + 1;
        return 0;
      }

      for(int i = 1; i <= n; i = i + 1) {
        if(getElement(checker, i) == 0) {
          setElement(checker, i, 1);
          permutations(n, k + 1, total, checker);
          setElement(checker, i, 0);
        }
      }

      return 0;
    }

    void main() {
      int n = 8, total = 5100, checker = 3000;
      permutations(n, 0, total, checker);
      printLine(*total);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '40320', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v1', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int isLineFull(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    void main() {
      int board = 3000;
      printLine(isLineFull(board, 0, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '0', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v2', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 0, 0, 3, 1);
      setElementInMatrix(board, 0, 1, 3, 1);
      setElementInMatrix(board, 0, 2, 3, 1);
      printLine(getLineResult(board, 0, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '1', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v3', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLines(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 0, 0, 3, 1);
      setElementInMatrix(board, 0, 1, 3, 1);
      printLine(getLineResult(board, 0, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '0', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v4', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 2, 0, 3, 1);
      setElementInMatrix(board, 2, 1, 3, 1);
      setElementInMatrix(board, 2, 2, 3, 1);
      printLine(getLinesResponse(board, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '1', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v5', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 2, 0, 3, 1);
      setElementInMatrix(board, 2, 1, 3, 1);
      printLine(getLinesResponse(board, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '0', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v6', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getColumnResult(int board, int column, int n) {
      int firstElement = getElementInMatrix(board, 0, column, n);
      if(firstElement == getElementInMatrix(board, 1, column, n) && 
         firstElement == getElementInMatrix(board, 2, column, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int getColumnResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getColumnResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int result(int board, int n) {
      int columnResult = getColumnResponse(board, n);
      if(columnResult) {
        return columnResult;
      }
      int rowResult = getLinesResponse(board, n);
      if(rowResult) {
        return rowResult;
      }
      return 0;
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 2, 0, 3, 1);
      setElementInMatrix(board, 2, 1, 3, 1);
      printLine(result(board, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '0', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v7', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getColumnResult(int board, int column, int n) {
      int firstElement = getElementInMatrix(board, 0, column, n);
      if(firstElement == getElementInMatrix(board, 1, column, n) && 
         firstElement == getElementInMatrix(board, 2, column, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int getColumnResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getColumnResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int result(int board, int n) {
      int columnResult = getColumnResponse(board, n);
      if(columnResult) {
        return columnResult;
      }
      int rowResult = getLinesResponse(board, n);
      if(rowResult) {
        return rowResult;
      }
      return 0;
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 2, 0, 3, 2);
      setElementInMatrix(board, 2, 1, 3, 2);
      setElementInMatrix(board, 2, 2, 3, 2);
      printLine(result(board, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '2', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v7', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getColumnResult(int board, int column, int n) {
      int firstElement = getElementInMatrix(board, 0, column, n);
      if(firstElement == getElementInMatrix(board, 1, column, n) && 
         firstElement == getElementInMatrix(board, 2, column, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int getColumnResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getColumnResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int result(int board, int n) {
      int columnResult = getColumnResponse(board, n);
      if(columnResult) {
        return columnResult;
      }
      int rowResult = getLinesResponse(board, n);
      if(rowResult) {
        return rowResult;
      }
      return 0;
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 0, 2, 3, 2);
      setElementInMatrix(board, 1, 2, 3, 2);
      setElementInMatrix(board, 2, 2, 3, 2);
      printLine(result(board, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  
  t.equal(asmBlock.getStdoutResponse(), '2', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v8', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getColumnResult(int board, int column, int n) {
      int firstElement = getElementInMatrix(board, 0, column, n);
      if(firstElement == getElementInMatrix(board, 1, column, n) && 
         firstElement == getElementInMatrix(board, 2, column, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int getColumnResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getColumnResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int columns(int board, int n) {
      int firstElement = getElementInMatrix(board, 0, 0, n);
      if(firstElement == getElementInMatrix(board, 1, 1, n) &&
         firstElement == getElementInMatrix(board, 2, 2, n)) {
          return firstElement;
      }

      firstElement = getElementInMatrix(board, 0, 2, n);
      if(firstElement == getElementInMatrix(board, 1, 1, n) &&
         firstElement == getElementInMatrix(board, 2, 0, n)) {
          return firstElement;
      }

      return 0;
    }

    int result(int board, int n) {
      int columnResult = getColumnResponse(board, n);
      if(columnResult) {
        return columnResult;
      }
      int rowResult = getLinesResponse(board, n);
      if(rowResult) {
        return rowResult;
      }
      return columns(board, n);
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 0, 0, 3, 2);
      setElementInMatrix(board, 1, 1, 3, 2);
      setElementInMatrix(board, 2, 2, 3, 2);
      printLine(result(board, 3));
      setElementInMatrix(board, 2, 2, 3, 0);
      printLine(result(board, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();

  t.equal(asmBlock.getStdoutResponse(), '2\n0', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v10', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getColumnResult(int board, int column, int n) {
      int firstElement = getElementInMatrix(board, 0, column, n);
      if(firstElement == getElementInMatrix(board, 1, column, n) && 
         firstElement == getElementInMatrix(board, 2, column, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int getColumnResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int columnResult = getColumnResult(board, i, n);
        if(columnResult) {
          return columnResult;
        }
      }

      return 0;
    }

    int diag(int board, int n) {
      int firstElement = getElementInMatrix(board, 0, 0, n);
      if(firstElement == getElementInMatrix(board, 1, 1, n) &&
         firstElement == getElementInMatrix(board, 2, 2, n)) {
          return firstElement;
      }

      firstElement = getElementInMatrix(board, 0, 2, n);
      if(firstElement == getElementInMatrix(board, 1, 1, n) &&
         firstElement == getElementInMatrix(board, 2, 0, n)) {
        return firstElement;
      }

      return 0;
    }

    int isDraw(int board) {
      for(int i = 0; i < 3; i = i + 1) {
        for(int j = 0; j < 3; j = j + 1) {
          if(getElementInMatrix(board, i, j, 3) == 0) {
            return 0;
          }
        }
      }

      return 1;
    }

    int resultMethod(int board, int n) {
      int columnResult = getColumnResponse(board, n);
      if(columnResult != 0) {
        return columnResult;
      }
      int rowResult = getLinesResponse(board, n);
      if(rowResult != 0) {
        return rowResult;
      }
      int diagLines = diag(board, n);
      if(diagLines != 0) {
        return diagLines;
      }
      int drawValues = isDraw(board);
      if(drawValues != 0) {
        return 3;
      }
      return 0;
    }

    int aiMove(int board, int move, int n, int bestX, int bestY, int depth) {
      int result = resultMethod(board, n);
      if(result == move) {
        return 50;
      }
      if(result == 3 - move) {
        return 0 - 50;
      }
      if(result == 3) {
        return 20;
      }

      int globalMax = 0 - 100;
      for(int i = 0; i < 3; i = i + 1) {
        for(int j = 0; j < 3; j = j + 1) {
          if(getElementInMatrix(board, i, j, n) == 0) {
            setElementInMatrix(board, i, j, 3, move);
            int currentMax = 0 - aiMove(board, 3 - move, n, bestX, bestY, depth + 1);
            if(currentMax == 20 || currentMax == 0 - 20) {
              currentMax = 20;
            }
            setElementInMatrix(board, i, j, 3, 0);

            if(currentMax > globalMax) {
              globalMax = currentMax;
              if(depth == 0) {
                *bestX = j;
                *bestY = i;
              }
            }
          }
        }
      }

      return globalMax;
    }

    void main() {
      int board = 3000, bestX = 5000, bestY = 5200;
      setElementInMatrix(board, 0, 0, 3, 1);
      printLine(aiMove(board, 2, 3, bestX, bestY, 0));
      printLine(*bestX);
      printLine(*bestY);
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '20\n1\n1', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});

test('Pointer tic tac toe AI v9', (t) => {
  const program = new Program(`
    int getElementInMatrix(int board, int i, int j, int n) {
      return getElement(board, i * n + j);
    }

    int setElementInMatrix(int board, int i, int j, int n, int element) {
      return setElement(board, i * n + j, element);
    }

    int getLineResult(int board, int line, int n) {
      int firstElement = getElementInMatrix(board, line, 0, n);
      if(firstElement == getElementInMatrix(board, line, 1, n) && 
         firstElement == getElementInMatrix(board, line, 2, n)) {
        return firstElement;
      }

      return 0;
    }

    int getColumnResult(int board, int column, int n) {
      int firstElement = getElementInMatrix(board, 0, column, n);
      if(firstElement == getElementInMatrix(board, 1, column, n) && 
         firstElement == getElementInMatrix(board, 2, column, n)) {
        return firstElement;
      }

      return 0;
    }

    int getLinesResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getLineResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int getColumnResponse(int board, int n) {
      for(int i = 0; i < 3; i = i + 1) {
        int lineResult = getColumnResult(board, i, n);
        if(lineResult) {
          return lineResult;
        }
      }

      return 0;
    }

    int columns(int board, int n) {
      int firstElement = getElementInMatrix(board, 0, 0, n);
      if(firstElement == getElementInMatrix(board, 1, 1, n) &&
         firstElement == getElementInMatrix(board, 2, 2, n)) {
        return firstElement;
      }

      firstElement = getElementInMatrix(board, 0, 2, n);
      if(firstElement == getElementInMatrix(board, 1, 1, n) &&
         firstElement == getElementInMatrix(board, 2, 0, n)) {
          return firstElement;
      }

      return 0;
    }

    int result(int board, int n) {
      int columnResult = getColumnResponse(board, n);
      if(columnResult) {
        return columnResult;
      }
      int rowResult = getLinesResponse(board, n);
      if(rowResult) {
        return rowResult;
      }
      return columns(board, n);
    }

    void main() {
      int board = 3000;
      setElementInMatrix(board, 0, 0, 3, 2);
      setElementInMatrix(board, 1, 0, 3, 1);
      setElementInMatrix(board, 2, 0, 3, 2);
      printLine(getColumnResult(board, 0, 3));
      setElementInMatrix(board, 1, 0, 3, 2);
      printLine(getColumnResult(board, 0, 3));
    }
  `)
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  let programCompiler = new Compiler(null);
  let asmBlock = programCompiler.compileProgram(chomp);
  asmBlock.run();
  t.equal(asmBlock.getStdoutResponse(), '0\n2', 'returns');
  t.equal(asmBlock.runner.initialStackPointer, asmBlock.runner.stackPointer, 'returns');

  t.end();
});
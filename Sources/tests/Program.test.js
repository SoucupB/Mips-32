import tap from 'tap'
const { test } = tap;
import { Program } from '../Checker/Program.js';

test('Check Program checker (valid) v1', (t) => {
  let program = new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(program.errors.length, 0, 'returns');
  t.end();
});

test('Check Program checker (valid) v2', (t) => {
  let program = new Program('int a=0;int main(){int z=0;int b=0;for(int i=0;i<100;i=i+1){}int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(program.errors.length, 0, 'returns');
  t.end();
});

test('Check Program checker (missing main method) v2', (t) => {
  let program = new Program('int a=0;int mains(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}');
  let chomp = program.chomp();
  
  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});

test('Check Program checker (multiple main definitions) v3', (t) => {
  let program = new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int main(){int t=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});

test('Check Program checker (multiple definition of test method) v4', (t) => {
  let program = new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}int test(int z, int d){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});

test('Check Program checker (block in static space) v1', (t) => {
  let program = new Program('int a=0;{int b=0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 1;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (block in static space) v2', (t) => {
  let program = new Program('int a=0;{}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (block in static space) v3', (t) => {
  let program = new Program('int a=0;for(int i=0;i<5;i=i+1){}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (block in static space) v3', (t) => {
  let program = new Program('int a=0;if(a==0){}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (block space) v1', (t) => {
  let program = new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Program checker (block space) v2', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Program checker (block space) v3', (t) => {
  let program = new Program('int a=0;int coco(int a,int t){return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (block space) v4', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int z;return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (block space) v5', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Program checker (block space) v6', (t) => {
  let program = new Program('int a=0;int a(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (reserved keywords) v1', (t) => {
  let program = new Program('int int=0;int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (reserved keywords) v2', (t) => {
  let program = new Program('int for=0;int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (reserved keywords) v3', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;if(a==b){z=1;int if=0;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (method calls) v1', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;int fp=coco(5,6);if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Program checker (method calls) v2', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;int fp=coco(5,6,7);if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});

test('Check Program checker (method calls) v3', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;int fp=coco(5,coco(7));if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});

test('Check Program checker (method calls) v4', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt;return 0;}int main(){int z=0;int b=0;int c=0;int fp=coco(5,coco(6,7));if(a==b){z=1;}return 0;}int test(int z){int c=0;return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(program.errors.length, 0, 'returns');
  t.end();
});

test('Check Program checker (method return) v1', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt=5;return frt+z;}int main(){return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(program.errors.length, 0, 'returns');
  t.end();
});

test('Check Program checker (method return) v2', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt=5;return frt+z+b;}int main(){return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});

test('Check Program checker (method return) v3', (t) => {
  let program = new Program('int a=0;int coco(int z,int t){z=0;int frt=5;}int main(){return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Program checker (method return) v4', (t) => {
  let program = new Program('int a=0;void coco(int z,int t){z=0;int frt=5;}int main(){return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Program checker (method return) v5', (t) => {
  let program = new Program('int a=0;void coco(int z,int t){z=0;int frt=5;return z;}int main(){return 0;}');
  let chomp = program.chomp();
  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

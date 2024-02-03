import tap from 'tap'
const { test } = tap;
import { Program } from '../Checker/Program.js';
import { Methods } from '../Checker/Methods.js';

test('Check Program checker (valid) v1', (t) => {
  let program = new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(program.errors.length, 0, 'returns');
  t.end();
});

test('Check Program checker (missing main method) v2', (t) => {
  let program = new Program('int a=0;int mains(){int z=0;int b=0;int c=0;if(a==b){z=1;}}');
  let chomp = program.chomp();
  
  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});

test('Check Program checker (multiple main definitions) v3', (t) => {
  let program = new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}}int main(){int t=0;}');
  let chomp = program.chomp();

  t.equal(chomp.isInvalid(), true, 'returns');
  t.equal(program.errors.length, 1, 'returns');
  t.end();
});
import tap from 'tap'
const { test } = tap;
import { Assignation } from '../AST/Assignation.js';
import { StackDeclarations } from '../AST/StackDeclarations.js';
import { ErrorTypes } from '../AST/CompilationErrors.js';

test('Check Assignation checker v1', (t) => {
  let chomp = Assignation.chomp('a=b+3;', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 6, 'returns');
  t.end();
});

test('Check Assignation checker v2', (t) => {
  let chomp = Assignation.chomp('a=3*(b+3+(9+2-bada));', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Assignation checker v3', (t) => {
  let chomp = Assignation.chomp('a=3*(b+3+(9+2-bada)+3r);', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Assignation checker v4', (t) => {
  let chomp = Assignation.chomp('a=3*(b+3+(9+2-bada)+r)-da+da*3;', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Assignation checker v5', (t) => {
  let chomp = Assignation.chomp('adada=3*(b+3+(9+2-bada)+r)-da+da*3;', 0);

  t.equal(Assignation.toString(chomp), 'adada=3*(b+3+(9+2-bada)+r)-da+da*3;', 'returns');
  t.end();
});

test('Check Assignation checker v6', (t) => {
  let chomp = Assignation.chomp('adada=aaa+bbb-ccc/222+2;', 0);
  
  t.equal(Assignation.toString(chomp), 'adada=aaa+bbb-ccc/222+2;', 'returns');
  t.end();
});

test('Check Assignation checker v7', (t) => {
  let chomp = Assignation.chomp('adada==aaa+bbb-ccc/222+2;', 0);
  
  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Assignation checker v8', (t) => {
  let chomp1 = Assignation.chomp('a=b;c=a+2;t=3+2;', 0);
  let chomp2 = Assignation.chomp('a=b;c=a+2;t=3+2;', 4);
  let chomp3 = Assignation.chomp('a=b;c=a+2;t=3+2;', 10);
  
  t.equal(Assignation.toString(chomp1), 'a=b;', 'returns');
  t.equal(Assignation.toString(chomp2), 'c=a+2;', 'returns');
  t.equal(Assignation.toString(chomp3), 't=3+2;', 'returns');
  t.end();
});

test('Check Assignation checker v9', (t) => {
  let chomp = Assignation.chomp('a=b+2/c-d+oop;', 0);
  let stack = new StackDeclarations();

  t.equal(Assignation.toString(chomp), 'a=b+2/c-d+oop;', 'returns');
  t.equal(Assignation.findUnassignedVariables(chomp, stack).type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});

test('Check Assignation checker v10', (t) => {
  let chomp = Assignation.chomp('a=b+2/c-d+oop;', 0);
  let stack = new StackDeclarations();
  stack.push('a');
  stack.push('b');
  stack.push('c');
  stack.push('d');
  stack.push('oop');

  t.equal(Assignation.toString(chomp), 'a=b+2/c-d+oop;', 'returns');
  t.equal(Assignation.findUnassignedVariables(chomp, stack).type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check Assignation checker v11', (t) => {
  let chomp = Assignation.chomp('*adada=aaa+bbb-ccc/222+2;', 0);
  
  t.equal(Assignation.toString(chomp), '*adada=aaa+bbb-ccc/222+2;', 'returns');
  t.end();
});

test('Check Assignation checker v12', (t) => {
  let chomp = Assignation.chomp('*(adada+1)=aaa+bbb-ccc/222+2;', 0);
  
  t.equal(Assignation.toString(chomp), '*adada+1=aaa+bbb-ccc/222+2;', 'returns');
  t.end();
});

test('Check Assignation checker v13', (t) => {
  let chomp = Assignation.chomp('cana(2);', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});
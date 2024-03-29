import tap from 'tap'
const { test } = tap;
import { ConditionalBlocks } from '../AST/ConditionalBlocks.js';
import { StackDeclarations } from '../AST/StackDeclarations.js';
import { ErrorTypes } from '../AST/CompilationErrors.js';

test('Check ConditionalBlocks checker v1', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check ConditionalBlocks checker v2', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check ConditionalBlocks checker v3', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>*3||(c==9)){a=b+3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check ConditionalBlocks checker v4', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){for(int i=0;i<100;i=i+1){a=b+3;}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 54, 'returns');
  t.end();
});

test('Check ConditionalBlocks stack checker v1', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){int d=0;}', 0);
  let stackDeclaration = new StackDeclarations();
  stackDeclaration.push('a');
  stackDeclaration.push('b');
  stackDeclaration.push('c');

  let variableErrors = ConditionalBlocks.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variableErrors.type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check ConditionalBlocks stack checker v2', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){int d=0;}', 0);
  let stackDeclaration = new StackDeclarations();

  let variableErrors = ConditionalBlocks.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variableErrors.type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});

test('Check ConditionalBlocks stack checker v3', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){int d=0;}', 0);
  let stackDeclaration = new StackDeclarations();
  stackDeclaration.push('a');
  stackDeclaration.push('b');
  stackDeclaration.push('c');
  stackDeclaration.push('d');


  let variableErrors = ConditionalBlocks.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variableErrors.type, ErrorTypes.VARIABLE_MULTIPLE_DEFINITION, 'returns');
  t.end();
});

test('Check ConditionalBlocks stack checker v4', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){int d=0;if(d==5){}}', 0);
  let stackDeclaration = new StackDeclarations();
  stackDeclaration.push('a');
  stackDeclaration.push('b');
  stackDeclaration.push('c');


  let variableErrors = ConditionalBlocks.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variableErrors.type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check ConditionalBlocks stack checker v5', (t) => {
  let chomp = ConditionalBlocks.chomp('if(a<3&&b>3||(c==9)){if(d==5){}}', 0);
  let stackDeclaration = new StackDeclarations();
  stackDeclaration.push('a');
  stackDeclaration.push('b');
  stackDeclaration.push('c');


  let variableErrors = ConditionalBlocks.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variableErrors.type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});
import tap from 'tap'
const { test } = tap;
import { CodeBlock } from '../Checker/CodeBlock.js';
import { StackDeclarations } from '../Checker/StackDeclarations.js';

test('Check CodeBlock checker v1', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v2', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pen=3+b-3/2;}', 0);
  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v3', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pen=3+b-3/2;{b=3;c=5+2;}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v4', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int }pen=3+b-3/2;{b=3;c=5+2;}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v5', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pen=3+b-3/2;{b=3;c=5+2;}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v6', (t) => {
  let chomp = CodeBlock.chomp('{a=b+3;int pe}n=3+b-3/2;{b=3;c=5+2;}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v7', (t) => {
  let chomp = CodeBlock.chomp('{int a;b=3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v8', (t) => {
  let chomp = CodeBlock.chomp('{int a;b=3;', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v9', (t) => {
  let chomp = CodeBlock.chomp('int a;b=3;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v10', (t) => {
  let chomp = CodeBlock.chomp('{int a;b=3;}{f=3;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 12, 'returns');
  t.end();
});

test('Check CodeBlock checker v11', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=5;i=i+1){for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v12', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=4a;i=i+1){for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v13', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=a;i=i+1){while(z>5){b=z+1;}for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v14', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=a;i=i+1){if(a==5){z=5;}while(z>5){b=z+1;}for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v15', (t) => {
  let chomp = CodeBlock.chomp('{int c=0;while(c<10){for(int i=0;i<=a;i=i+1)if{while(z>5){b=z+1;}for(int j=0;j<=5;j=j+1){c=i+j;}}}}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v16', (t) => {
  let chomp = CodeBlock.chomp('', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check CodeBlock checker v17', (t) => {
  let chomp = CodeBlock.chomp('{}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock checker v18', (t) => {
  let chomp = CodeBlock.chomp('{{}}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v1', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 0, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v2', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;}}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 0, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v3', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;int a=16;}}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 1, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v4', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;c=b+a;}}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 0, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v5', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;d=b+a;}}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 1, 'returns');
  t.equal(variablesErrors[1].length, 0, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v6', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;c=b+a;}int c=0;}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 0, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v7', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;c=b+a;int d=7+5;}int c=0,d=17;}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 0, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v8', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;c=b+a;int d=7+5;}int c=0,b=17;}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 1, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v9', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;c=b+a;int d=7+5;{int u=17;}int u=15;}int c=0,u=17;}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 0, 'returns');
  t.end();
});

test('Check CodeBlock internal stack validity v10', (t) => {
  let chomp = CodeBlock.chomp('{int a=0;int b=5;{int c=a+b;c=b+a;int d=7+5;{int u=17;char c=13;}int u=15;}int c=0,u=17;}', 0);
  let stackDeclaration = new StackDeclarations();
  let variablesErrors = CodeBlock.addToStackAndVerify(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(variablesErrors[0].length, 0, 'returns');
  t.equal(variablesErrors[1].length, 1, 'returns');
  t.end();
});
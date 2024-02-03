import tap from 'tap'
const { test } = tap;
import { Methods } from '../Checker/Methods.js';

test('Check Methods checker v1', (t) => {
  let chomp = Methods.chompDeclaration('int someMethod(int a,int b){int b=5;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Methods checker v2', (t) => {
  let chomp = Methods.chompDeclaration('intt someMethod(int a,int b){int b=5;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v3', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int a,int b){int b=5;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Methods checker v4', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Methods checker v5', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int 43_dafb){int b=5;}', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v6', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;}', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 46, 'returns');
  t.end();
});

test('Check Methods checker v7', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;}dafafagag', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 46, 'returns');
  t.end();
});

test('Check Methods checker v8', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;dafafagag', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v9', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;}dafafagag', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 46, 'returns');
  t.end();
});

test('Check Methods checker v10', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;for(int i=0;i<10;i=i+1){if(a==10){b=10;}a=b;}}dafafagag', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 91, 'returns');
  t.end();
});

test('Check Methods checker v11', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;for(int i=0;i<10;i=i+1){if(a==10){b=10;}a=b;}dafafagag', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v12', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int _aaga,int _dafb){int b=5;for(int i=0;i<10;i=i+1){if(a==10){b=10;}a=b;{}dafafagag', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v13', (t) => {
  let chomp = Methods.chompMethodCall('someMethod(a,b)', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Methods checker v14', (t) => {
  let chomp = Methods.chompMethodCall('someMethod(a+32-3+(b+c)-2,b-c)', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 30, 'returns');
  t.end();
});

test('Check Methods checker v15', (t) => {
  let chomp = Methods.chompMethodCall('someMethod(a+32-3+(b+c)-2,b-c,v-2,p/2)', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Methods checker v16', (t) => {
  let chomp = Methods.chompMethodCall('someMethod(a+32-3+(b+c-)-2,b-c,v-2,p/2)', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v17', (t) => {
  let chomp = Methods.chompMethodCall('someMethod(a+32-3+(b+c)-2,b-c,v-2,p/2', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v18', (t) => {
  let chomp = Methods.chompMethodCall('someMethod(a+32-3+(b+c)-2,b-c,v-2p/2)', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v19', (t) => {
  let chomp = Methods.chompMethodCall('someMethoda+32-3+(b+c)-2,b-c,v-2,p/2)', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v20', (t) => {
  let chomp = Methods.chompMethodCall('some+Method(a+32-3+(b+c)-2,b-c,v-2,p/2)', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v21', (t) => {
  let chomp = Methods.chompMethodCall('_325someMethod(a+32-3+(b+c)-2,b-c,v-2,p/2)', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Methods checker v22', (t) => {
  let chomp = Methods.chompMethodCall('43_325someMethod(a+32-3+(b+c)-2,b-c,v-2,p/2)', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v23', (t) => {
  let chomp = Methods.chompMethodCall('someMethod', 0);

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Methods checker v24', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(int a){int b=0;}fafafa', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 32, 'returns');
  t.end();
});

test('Check Methods checker v25', (t) => {
  let chomp = Methods.chompDeclaration('void someMethod(){int b=0;}fafafa', 0);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 27, 'returns');
  t.end();
});
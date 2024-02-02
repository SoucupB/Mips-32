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
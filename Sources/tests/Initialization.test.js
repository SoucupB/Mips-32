import tap from 'tap'
const { test } = tap;
import { Initialization, Keyword } from '../Checker/Initialization.js';

test('Check Initialization checker v1', (t) => {
  t.equal(Initialization.isValid('a'), false, 'returns');
  t.end();
});

test('Check Initialization checker v2', (t) => {
  t.equal(Initialization.isValid('dafa'), false, 'returns');
  t.end();
});

test('Check Initialization checker v3', (t) => {
  t.equal(Initialization.isValid('int a=0;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v4', (t) => {
  t.equal(Initialization.isValid('int a=b+3-3+4;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v5', (t) => {
  t.equal(Initialization.isValid('cata a=b+3-3+4;'), false, 'returns');
  t.end();
});

test('Check Initialization checker v6', (t) => {
  t.equal(Initialization.isValid('int a=b+3-3+(32+4&&2)+4;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v7', (t) => {
  t.equal(Initialization.isValid('char a=b+3-3+(32+4&&2)+4;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v8', (t) => {
  t.equal(Initialization.isValid('char _newVar=b+3-3+(32+4&&2)+4;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v9', (t) => {
  t.equal(Initialization.isValid('char 3_newVar=b+3-3+(32+4&&2)+4;'), false, 'returns');
  t.end();
});

test('Check Initialization checker v10', (t) => {
  t.equal(Initialization.isValid('char _newVar=b+3-3+(32+4&&2)-+4;'), false, 'returns');
  t.end();
});

test('Check Initialization checker v11', (t) => {
  t.equal(Initialization.isValid('char _newVar=b+3-3+(32+4&&||2)+4;'), false, 'returns');
  t.end();
});

test('Check Initialization checker v12', (t) => {
  t.equal(Initialization.isValid('char _newVar=b+3-3+(32+4&&(2||3)/2)+4;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v13', (t) => {
  t.equal(Initialization.isValid('char _newVar=b+3-3+(32+4&&(2||3)/2)+4,vec=32+22;'), true, 'returns');
  t.end();
});

test('Check Initialization checker v14', (t) => {
  t.equal(Initialization.isValid('char a=b+3-3+(32+4&&(2||3)/2)+4,vec=32+22,scor=32+(44-2+2);'), true, 'returns');
  t.end();
});

test('Check Initialization checker v15', (t) => {
  t.equal(Initialization.isValid('char a=b+3-3+(32+4&&(2||3)/2)+4,vec=32+22,scor=32+(44-2+2),z=--2;'), false, 'returns');
  t.end();
});

test('Check Initialization checker v16', (t) => {
  const chomp = Initialization.chomp('char a=2;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v17', (t) => {
  const chomp = Initialization.chomp('char a=2;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v18', (t) => {
  const chomp = Initialization.chomp('char a=2,c=3,zz_f=2;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v18', (t) => {
  const chomp = Initialization.chomp('char 3a=2,c=3,zz_f=2;', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker v19', (t) => {
  const chomp = Initialization.chomp('pidchar a=2,c=3,zz_f=2;', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker v20', (t) => {
  const chomp = Initialization.chomp('pidchar a=2,c=3,zz_f=2;', 3)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});
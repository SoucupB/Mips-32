import tap from 'tap'
const { test } = tap;
import { Initialization, Keyword } from '../AST/Initialization.js';
import { StackDeclarations } from '../AST/StackDeclarations.js';
import { ErrorTypes } from '../AST/CompilationErrors.js';

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

test('Check Initialization checker v21', (t) => {
  const chomp = Initialization.chomp('char a;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v22', (t) => {
  const chomp = Initialization.chomp('int a;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v23', (t) => {
  const chomp = Initialization.chomp('int a', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker v24', (t) => {
  const chomp = Initialization.chomp('inta;', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker v25', (t) => {
  const chomp = Initialization.chomp('int a-4;', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker v26', (t) => {
  const chomp = Initialization.chomp('int a=3+4+5', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker v27', (t) => {
  const chomp = Initialization.chomp('int a=3+4+5;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v28', (t) => {
  const chomp = Initialization.chomp('int adafg;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check Initialization checker v29', (t) => {
  const chomp = Initialization.chomp('int adafg=3+4-(2-22)+b;', 0)

  t.equal(Initialization.display(chomp), 'int -> adafg=3+4-(2-22)+b', 'returns');
  t.end();
});

test('Check Initialization checker v30', (t) => {
  const chomp = Initialization.chomp('int adafg=3+4-(2-22)+b,crt=3-4;', 0)

  t.equal(Initialization.display(chomp), 'int -> adafg=3+4-(2-22)+b -> crt=3-4', 'returns');
  t.end();
});

test('Check Initialization checker v31', (t) => {
  const chomp = Initialization.chomp('int adafg=3+4-(2-22)+b,crt=3-4,a=b,c=32+22;', 0)

  t.equal(Initialization.display(chomp), 'int -> adafg=3+4-(2-22)+b -> crt=3-4 -> a=b -> c=32+22', 'returns');
  t.equal(chomp.index, 43, 'returns');
  t.end();
});

test('Check Initialization checker v32', (t) => {
  const chomp1 = Initialization.chomp('int adafg=a+b-2;int yolo=33+22-a;', 0)
  const chomp2 = Initialization.chomp('int adafg=a+b-2;int yolo=33+22-a;', 16)

  t.equal(Initialization.display(chomp1), 'int -> adafg=a+b-2', 'returns');
  t.equal(chomp1.index, 16, 'returns');
  t.equal(Initialization.display(chomp2), 'int -> yolo=33+22-a', 'returns');
  t.end();
});

test('Check Initialization checker v33 (undefined variables)', (t) => {
  const chomp = Initialization.chomp('int adafg=a+b-2;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.display(chomp), 'int -> adafg=a+b-2', 'returns');
  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});

test('Check Initialization checker v34 (undefined variables)', (t) => {
  const chomp = Initialization.chomp('int a=5,b=6,adafg=a+b-2;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.display(chomp), 'int -> a=5 -> b=6 -> adafg=a+b-2', 'returns');
  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check Initialization checker v35 (undefined variables)', (t) => {
  const chomp = Initialization.chomp('int a=5,b=6,adafg=a+b-2,c=p+2;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});

test('Check Initialization checker v36 (defined variables)', (t) => {
  const chomp = Initialization.chomp('int a,adafg=a+2;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check Initialization checker v37 (undefined variables)', (t) => {
  const chomp = Initialization.chomp('int a,adafg=b+2;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});

test('Check Initialization checker v38 (multiple definitions)', (t) => {
  const chomp = Initialization.chomp('int a,adafg=a+2,adafg;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.VARIABLE_MULTIPLE_DEFINITION, 'returns');
  t.end();
});

test('Check Initialization checker v39 (multiple definitions)', (t) => {
  const chomp = Initialization.chomp('int a,adafg=a+2,a=3;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.VARIABLE_MULTIPLE_DEFINITION, 'returns');
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 20, 'returns');
  t.end();
});

test('Check Initialization checker v40 (multiple definitions)', (t) => {
  const chomp1 = Initialization.chomp('int a,adafg=a+2;', 0)
  const chomp2 = Initialization.chomp('int b=2,c=adafg+3;', 0)
  let stackDeclaration = new StackDeclarations();

  let chomp1Variables = Initialization.addToStackAndVerify(chomp1, stackDeclaration);
  let chomp2Variables = Initialization.addToStackAndVerify(chomp2, stackDeclaration);

  t.equal(chomp1Variables.type, ErrorTypes.NO_ERRORS, 'returns');
  t.equal(chomp2Variables.type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check Initialization checker v41 (multiple definitions)', (t) => {
  const chomp1 = Initialization.chomp('int a,  adafg=a+  2;', 0)
  const chomp2 = Initialization.chomp('int b=2,c=adafg+3,a=50;', 0)
  let stackDeclaration = new StackDeclarations();

  let chomp1Variables = Initialization.addToStackAndVerify(chomp1, stackDeclaration);
  let chomp2Variables = Initialization.addToStackAndVerify(chomp2, stackDeclaration);

  t.equal(chomp1Variables.type, ErrorTypes.NO_ERRORS, 'returns');
  t.equal(chomp2Variables.type, ErrorTypes.VARIABLE_MULTIPLE_DEFINITION, 'returns');
  t.end();
});

test('Check Initialization checker with spaces v1', (t) => {
  const chomp = Initialization.chomp('int a =  5,b =   6,adafg =  a +b -  2   ;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.display(chomp), 'int -> a=5 -> b=6 -> adafg=a+b-2', 'returns');
  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check Initialization checker with spaces v2', (t) => {
  const chomp = Initialization.chomp('int a =  5,  b =   6,adafg =  a +b -  2   ;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.display(chomp), 'int -> a=5 -> b=6 -> adafg=a+b-2', 'returns');
  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check Initialization checker with spaces v3', (t) => {
  const chomp = Initialization.chomp('int a =  5   ,  b =   6,adafg =  a +b -  2   ;', 0)
  let stackDeclaration = new StackDeclarations();

  t.equal(Initialization.display(chomp), 'int -> a=5 -> b=6 -> adafg=a+b-2', 'returns');
  t.equal(Initialization.addToStackAndVerify(chomp, stackDeclaration).type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check Initialization checker with spaces v4', (t) => {
  const chomp = Initialization.chomp('int a =  5   ,  b =   6,adafg =  a +b -  2   ;', 0)

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 46, 'returns');
  t.end();
});

test('Check Initialization checker with spaces v5', (t) => {
  const chomp = Initialization.chomp('inta =  5   ,  b =   6,adafg =  a +b -  2   ;', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker with spaces v6', (t) => {
  const chomp = Initialization.chomp('inta =  5   ,  b =   6,   adafg   a +b -  2   ;', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check Initialization checker with spaces v6', (t) => {
  const chomp = Initialization.chomp('int a = 5b=6;', 0)

  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});
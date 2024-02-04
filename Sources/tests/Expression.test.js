import tap from 'tap'
const { test } = tap;
import Expression from '../AST/Expression.js';
import { StackDeclarations } from '../AST/StackDeclarations.js';
import { ErrorTypes } from '../AST/CompilationErrors.js';

test('Check expression v1', (t) => {
  t.equal(Expression.isValid('a'), true, 'returns');
  t.end();
});

test('Check expression v2', (t) => {
  t.equal(Expression.isValid('A'), true, 'returns');
  t.end();
});

test('Check expression v3', (t) => {
  t.equal(Expression.isValid('Ada23_da'), true, 'returns');
  t.end();
});

test('Check expression v4', (t) => {
  t.equal(Expression.isValid('32Ada23_da'), false, 'returns');
  t.end();
});

test('Check expression v5', (t) => {
  t.equal(Expression.isValid('a+b'), true, 'returns');
  t.end();
});

test('Check expression v6', (t) => {
  t.equal(Expression.isValid('a+3b'), false, 'returns');
  t.end();
});

test('Check expression v7', (t) => {
  t.equal(Expression.isValid('a+_b'), true, 'returns');
  t.end();
});

test('Check expression v8', (t) => {
  t.equal(Expression.isValid('a+_b/2*4||2+1'), true, 'returns');
  t.end();
});

test('Check expression v9', (t) => {
  t.equal(Expression.isValid('a+_b/2*4|||2+1'), false, 'returns');
  t.end();
});

test('Check expression v10', (t) => {
  t.equal(Expression.isValid('a+_b/2+*4||2+1'), false, 'returns');
  t.end();
});

test('Check expression v11', (t) => {
  t.equal(Expression.isValid('a+_b/2*4||2+1/3/4+2+1-3*8&&3-9+0==1+4'), true, 'returns');
  t.end();
});

test('Check expression v12', (t) => {
  t.equal(Expression.isValid('a+_b/2*4||2+1/3/4+2+1-3*8&&3-&9+0==1+4'), false, 'returns');
  t.end();
});

test('Check expression v13', (t) => {
  t.equal(Expression.isValid('5+(3+2)+3'), true, 'returns');
  t.end();
});

test('Check expression v14', (t) => {
  t.equal(Expression.isValid('(3+2)+3*5'), true, 'returns');
  t.end();
});

test('Check expression v14', (t) => {
  t.equal(Expression.isValid('2+3*5+(3+2)'), true, 'returns');
  t.end();
});

test('Check expression v15', (t) => {
  t.equal(Expression.isValid('2+3*5+(3+ana+mere+32)*5'), true, 'returns');
  t.end();
});

test('Check expression v16', (t) => {
  t.equal(Expression.isValid('2+3*5+(3+ana+mer+5e+e+32)*5'), false, 'returns');
  t.end();
});

test('Check expression v17', (t) => {
  t.equal(Expression.isValid('2+3*5+(3+ana+mer+5+(5&5)+e+32)*5'), true, 'returns');
  t.end();
});

test('Check expression v18', (t) => {
  t.equal(Expression.isValid('2+3*5+(3+ana+mer+5+(5&5+(6))+e+32)*5'), true, 'returns');
  t.end();
});

test('Check expression v19', (t) => {
  t.equal(Expression.isValid('2+3*5+(3+ana)+mer+5+(5&5+(6))+e+32)*5'), false, 'returns');
  t.end();
});

test('Check expression v20', (t) => {
  t.equal(Expression.isValid('2+3*5+(3+ana()))+mer+5+(5&5+(6))+e+32)*5'), false, 'returns');
  t.end();
});

test('Check expression v21', (t) => {
  t.equal(Expression.isValid('(((1)))'), true, 'returns');
  t.end();
});

test('Check expression v22', (t) => {
  t.equal(Expression.isValid('(((1))*4)'), true, 'returns');
  t.end();
});

test('Check expression v23', (t) => {
  t.equal(Expression.isValid(')(((1))*4)'), false, 'returns');
  t.end();
});

test('Check expression v24', (t) => {
  t.equal(Expression.isValid('(_)+(((1))*4)'), true, 'returns');
  t.end();
});

test('Check expression v25', (t) => {
  t.equal(Expression.isValid('(_)+(((1))*4)+(+3)'), false, 'returns');
  t.end();
});

test('Check expression v26', (t) => {
  let chomp = Expression.chomp('4+5+(4+3)', 0);
  t.equal(chomp.toString(), '4+5+(4+3)', 'returns');
  t.end();
});

test('Check expression v27', (t) => {
  let chomp = Expression.chomp('(_)+(((1))*4)', 0);
  t.equal(chomp.toString(), '(_)+(((1))*4)', 'returns');
  t.end();
});

test('Check expression v28', (t) => {
  let chomp = Expression.chomp('(_)+(((1))*4)+(3+)', 0);
  t.equal(chomp.toString(), '(_)+(((1))*4)', 'returns');
  t.end();
});

test('Check expression v29', (t) => {
  let chomp = Expression.chomp('(_)+(((1))*4)+(3+3)', 0);
  t.equal(chomp.toString(), '(_)+(((1))*4)+(3+3)', 'returns');
  t.end();
});

test('Check expression v30', (t) => {
  let chomp = Expression.chomp('(_)+(((1))*4)+(3+3-3+(0-))', 0);
  t.equal(chomp.toString(), '(_)+(((1))*4)', 'returns');
  t.end();
});

test('Check expression v31', (t) => {
  let chomp = Expression.chomp('(_)+(((1))*4)+(3+3-3+(0-zzz))', 0);
  t.equal(chomp.toString(), '(_)+(((1))*4)+(3+3-3+(0-zzz))', 'returns');
  t.end();
});

test('Check expression v32', (t) => {
  let chomp = Expression.chomp('(4+3)-3', 0);
  t.equal(chomp.toString(), '(4+3)-3', 'returns');
  t.end();
});

test('Check expression v33', (t) => {
  let chomp = Expression.chomp('3+(4+3)-3', 2);
  t.equal(chomp.toString(), '(4+3)-3', 'returns');
  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});

test('Check expression v34', (t) => {
  let chomp = Expression.chomp('(_)+(((1))*4)+(3+3-3+(0-zzz))', 4);
  t.equal(chomp.toString(), '(((1))*4)+(3+3-3+(0-zzz))', 'returns');
  t.end();
});

test('Check expression v35', (t) => {
  let chomp = Expression.chomp('(_)+(((1))*4)+(3+3-3+(0-zzz))', 3);
  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check expression v36', (t) => {
  let chomp = Expression.chomp('((((((5))))))', 0);
  t.equal(chomp.toString(), '((((((5))))))', 'returns');
  t.end();
});

test('Check expression v37', (t) => {
  let chomp = Expression.chomp('((((((5)))))', 0);
  t.equal(chomp.isInvalid(), true, 'returns');
  t.end();
});

test('Check expression v38', (t) => {
  let chomp = Expression.chomp('(((((5))))))', 0); 
  t.equal(chomp.toString(), '(((((5)))))', 'returns');
  t.end();
});

test('Check with methods v1', (t) => {
  let chomp = Expression.chomp('a+b+f(2)', 0); 
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 8, 'returns');
  t.end();
});

test('Check with methods v2', (t) => {
  let chomp = Expression.chomp('a+b+f(2,a+b,b-c)+d', 0); 
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 18, 'returns');
  t.end();
});

test('Check with methods v3', (t) => {
  let chomp = Expression.chomp('a+b+f(2,a+b,b-c+d', 0); 
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 5, 'returns');
  t.end();
});

test('Check with methods v4', (t) => {
  let chomp = Expression.chomp('a+b+f2,a+b,b-c)+d', 0); 
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 6, 'returns');
  t.end();
});

test('Check with methods v5', (t) => {
  let chomp = Expression.chomp('a+b+f(2,a+b,b-c)+3d', 0); 
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 18, 'returns');
  t.end();
});

test('Check with methods v6', (t) => {
  let chomp = Expression.chomp('a+b+f(2,a+b,b-c)+-5d', 0); 
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 16, 'returns');
  t.end();
});

test('Check with methods v7', (t) => {
  let chomp = Expression.chomp('a+b+f(2,a+b+g(5-3,222),b-c)+-5d', 0); 
  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(chomp.index, 27, 'returns');
  t.end();
});

test('Check with methods v1 stack', (t) => {
  let chomp = Expression.chomp('a+b', 0);
  let stackDeclaration = new StackDeclarations();

  let stackResponse = Expression.checkStackInitialization(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(stackResponse.type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});

test('Check with methods v2 stack', (t) => {
  let chomp = Expression.chomp('a+b+f(z)', 0);
  let stackDeclaration = new StackDeclarations();
  stackDeclaration.pushMethod('f', [{
    name: 'a',
    type: 'char'
  }])

  let stackResponse = Expression.checkStackInitialization(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(stackResponse.type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});

test('Check with methods v3 stack', (t) => {
  let chomp = Expression.chomp('a+b+f(z)', 0);
  let stackDeclaration = new StackDeclarations();
  stackDeclaration.push('a')
  stackDeclaration.push('b')
  stackDeclaration.push('z')
  stackDeclaration.pushMethod('f', [{
    name: 'a',
    type: 'char'
  }])


  let stackResponse = Expression.checkStackInitialization(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(stackResponse.type, ErrorTypes.NO_ERRORS, 'returns');
  t.end();
});

test('Check with methods v4 stack', (t) => {
  let chomp = Expression.chomp('a+b+f(z,g(ff-dd),pp)', 0);
  let stackDeclaration = new StackDeclarations();
  stackDeclaration.pushMethod('f', [{
    name: 'a',
    type: 'char'
  },
  {
    name: 'b',
    type: 'char'
  },
  {
    name: 'c',
    type: 'char'
  }])
  stackDeclaration.pushMethod('g', [{
    name: 'a',
    type: 'char'
  }])


  let stackResponse = Expression.checkStackInitialization(chomp, stackDeclaration);

  t.equal(chomp.isInvalid(), false, 'returns');
  t.equal(stackResponse.type, ErrorTypes.VARIABLE_NOT_DEFINED, 'returns');
  t.end();
});


// Add expression tests with missing variables.
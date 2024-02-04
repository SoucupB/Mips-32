import tap from 'tap'
const { test } = tap;
import { ASMCompiler } from '../AST/ASMCompiler.js';

test('Check Program checker (method return) v6', (t) => {
  let program = new ASMCompiler('int a=0;int coco(int z,int t){z=0;int frt=5;if(frt==0){return 0;}}int main(){return 0;}');
  let asmCompiled = program.compile();
  console.log(asmCompiled)
  // t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});
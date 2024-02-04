import tap from 'tap'
const { test } = tap;
import { ASMCompiler } from '../AST/ASMCompiler.js';

test('Check Program checker (method return) v6', (t) => {
  let program = new ASMCompiler('int coco(int z,int t){z=0;int frt=5;if(frt==0){return 0;}}int main(){int a=0;return 0;}');
  let asmCompiled = program.compile();

  t.end();
});
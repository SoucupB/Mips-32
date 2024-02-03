import tap from 'tap'
const { test } = tap;
import { Program } from '../Checker/Program.js';

test('Check Program checker v1', (t) => {
  let chomp = (new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}}', 0)).chomp();

  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});
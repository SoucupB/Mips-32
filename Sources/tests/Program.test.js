import tap from 'tap'
const { test } = tap;
import { Program } from '../Checker/Program.js';
import { Methods } from '../Checker/Methods.js';

test('Check Program checker v1', (t) => {
  let chomp = (new Program('int a=0;int main(){int z=0;int b=0;int c=0;if(a==b){z=1;}}', 0)).chomp();

  // console.log(JSON.stringify(chomp, null, 2));
  let methodChomp = Methods.searchMethodByName(chomp, 'main');

  console.log(methodChomp)
  t.equal(chomp.isInvalid(), false, 'returns');
  t.end();
});
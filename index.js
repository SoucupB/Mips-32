import { Mips32Compiler } from "./Compiler.js";

const runButton = document.getElementById('runButton');
const compileButton = document.getElementById('compileButton');

runButton.addEventListener('click', () => {
  const code = document.getElementById('textarea1').value;
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();

  document.getElementById('textarea2').value = mipsCompiler.stdoutBuffer();
});

compileButton.addEventListener('click', () => {
  const code = document.getElementById('textarea1').value;
  console.log('Compiling code:', code);

  document.getElementById('textarea2').value = document.getElementById('textarea1').value
});

const compileCode = () => {
  const code = document.getElementById('textarea1').value;
  
}
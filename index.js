import { Mips32Compiler } from "./Compiler.js";
const monaco = require('monaco-editor');

const runButton = document.getElementById('runButton');
const compileButton = document.getElementById('compileButton');

var editor;

runButton.addEventListener('click', () => {
  // const code = document.getElementById('textarea1').value;
  const code = editor.getValue();
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
  // const code = document.getElementById('textarea1').value;
  const code = editor.getValue();
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  document.getElementById('textarea2').value = mipsCompiler.mips32Code().toString(true);
});

const compileCode = () => {
  const code = document.getElementById('textarea1').value;
  
}

const editorSetup = () => {
  editor = monaco.editor.create(document.getElementById('container'), {
    value: 'void main() {\n\t\n}',
    language: 'c'
  });
}

editorSetup();
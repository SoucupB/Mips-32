import { Mips32Compiler } from "./Compiler.js";
const monaco = require('monaco-editor');

const runButton = document.getElementById('runButton');
const compileButtonMips32 = document.getElementById('compileButtonMips32');
const compileButtonAsm = document.getElementById('compileButtonAsm');

var editor;

runButton.addEventListener('click', () => {
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

compileButtonMips32.addEventListener('click', () => {
  const code = editor.getValue();
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  document.getElementById('textarea2').value = mipsCompiler.mips32Code().toString(true);
});

compileButtonAsm.addEventListener('click', () => {
  const code = editor.getValue();
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  document.getElementById('textarea2').value = mipsCompiler.intermediaryAsm().toString();
});

const editorSetup = () => {
  editor = monaco.editor.create(document.getElementById('container'), {
    value: 'void main() {\n\tprintNumber(10);\n}',
    language: 'c'
  });
}

editorSetup();
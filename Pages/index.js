import { Mips32Compiler } from "./Compiler.js";
const monaco = require('monaco-editor');

const runButton = document.getElementById('runButton');
const compileButtonMips32 = document.getElementById('compileButtonMips32');
const compileButtonAsm = document.getElementById('compileButtonAsm');

var inputEditor;
var outputEditor;

runButton.addEventListener('click', () => {
  const code = inputEditor.getValue();
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  mipsCompiler.run();

  outputEditor.setValue(mipsCompiler.stdoutBuffer());
});

compileButtonMips32.addEventListener('click', () => {
  const code = inputEditor.getValue();
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  outputEditor.setValue(mipsCompiler.mips32Code().toString());
});

compileButtonAsm.addEventListener('click', () => {
  const code = inputEditor.getValue();
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: 1024 * 512,
    stackPointer: 1024 * 1024,
    memorySize: 1024 * 1024 * 4
  });
  mipsCompiler.compile();
  outputEditor.setValue(mipsCompiler.intermediaryAsm().toString());
});

const inputEditorSetup = () => {
  inputEditor = monaco.editor.create(document.getElementById('input-container'), {
    value: 'void main() {\n\tprintNumber(10);\n}',
    language: 'c'
  });
  monaco.editor.setTheme('vs-dark');
}

const outputEditorSetup = () => {
  monaco.languages.register({ id: 'asm' });

  monaco.languages.setMonarchTokensProvider('asm', {
    tokenizer: {
      root: [
        [/(\bMOV|ADD|SUB|JMP|NOP|INC|DEC|AND|OR|XOR)\b/i, "instruction"],
        [/(\b|-)\d+\b/, "number"],
        [/\b(r[0-9]+|pc|sp)\b/, "register"],
      ]
    }
  });

  outputEditor = monaco.editor.create(document.getElementById('output-container'), {
    value: '',
    language: 'asm'
  });
  monaco.editor.setTheme('vs-dark');

}

inputEditorSetup();
outputEditorSetup();
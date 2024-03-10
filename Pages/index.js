import { Mips32Compiler } from "./Compiler.js";
import { exampleAlgorithms } from "./exampleAlgorithms.js";
const monaco = require('monaco-editor');

const runButton = document.getElementById('runButton');
const compileButtonMips32 = document.getElementById('compileButtonMips32');
const compileButtonAsm = document.getElementById('compileButtonAsm');

var inputEditor;
var outputEditor;

const getValueFromFormDOM = (domID) => {
  const formElementDOM = document.getElementById(domID);

  return parseInt(formElementDOM.value);
}

runButton.addEventListener('click', () => {
  const code = inputEditor.getValue();

  const compilation = compile(code);
  compilation.run();

  outputEditor.setValue(compilation.stdoutBuffer());
});

compileButtonMips32.addEventListener('click', () => {
  const code = inputEditor.getValue();
  outputEditor.setValue(compile(code).mips32Code().toString());
});

compileButtonAsm.addEventListener('click', () => {
  const code = inputEditor.getValue();
  outputEditor.setValue(compile(code).intermediaryAsm().toString());
});

const inputEditorSetup = () => {
  inputEditor = monaco.editor.create(document.getElementById('input-container'), {
    value: 'void main() {\n\tprintNumber(10);\n}',
    language: 'c'
  });
  monaco.editor.setTheme('vs-dark');
}

const compile = (code) => {
  let mipsCompiler = new Mips32Compiler(code, {
    stdout: getValueFromFormDOM('stdout'),
    stackPointer: getValueFromFormDOM('stack_memory_pointer'),
    memorySize: getValueFromFormDOM('total_memory')
  });
  try {
    mipsCompiler.compile();
  } catch (error) {
    alert(error.message);
  }

  return mipsCompiler;
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

const changeExampleAlgorithm = () => {
  const selectedValue = document.getElementById('task').value;
  if(selectedValue in exampleAlgorithms) {
    inputEditor.setValue(exampleAlgorithms[selectedValue]);
  }
}

document.getElementById('task').addEventListener('change', changeExampleAlgorithm);
inputEditorSetup();
outputEditorSetup();
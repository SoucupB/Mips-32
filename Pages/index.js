const runButton = document.getElementById('runButton');
const compileButton = document.getElementById('compileButton');

runButton.addEventListener('click', () => {
  const code = document.getElementById('textarea1').value;
  console.log('Running code:', code);
});

compileButton.addEventListener('click', () => {
  const code = document.getElementById('textarea1').value;
  console.log('Compiling code:', code);
});
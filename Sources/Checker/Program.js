import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Character from "./Character.js";
import { MethodsParams } from "./MethodsParam.js";
import { CodeBlock } from "./CodeBlock.js";
import Operator from "./Operator.js";
import Expression from "./Expression.js";
import { Methods } from "./Methods.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { ConditionalBlocks } from "./ConditionalBlocks.js";
import { LoopBlocks } from "./LoopBlocks.js";
import { StackDeclarations } from "./StackDeclarations.js";

export class Program {
  constructor(code, errors = []) {
    this.code = code;
    this.errors = errors;
  }

  chomp() {
    let chomp = this._chomp(this.code, 0);
    if(chomp.isInvalid()) {
      this.errors.push('Compilation error!');
      return Chomp.invalid();
    }
    if(!this.validateChomp(chomp)) {
      return Chomp.invalid();
    }
    return chomp;
  }

  validateChomp(chomp) {
    let stackDeclaration = new StackDeclarations();
    let mainDeclarations = Methods.searchMethodByName(chomp, 'main');

    if(!mainDeclarations.length) {
      this.errors.push('Missing main method!');
      return false;
    }
    if(mainDeclarations.length > 1) {
      this.errors.push('Multiple main definitions!');
      return false;
    }

    return true;
  }

  _chomp(str, index) {
    let testingMethods = [Methods.chompDeclaration, Assignation.chomp, Initialization.chomp, ConditionalBlocks.chomp, LoopBlocks.chomp, CodeBlock.chomp];
    let response = [];

    while(index < str.length) {
      let isInstructionValid = false;

      for(let i = 0, c = testingMethods.length; i < c; i++) {
        let currentChomp = testingMethods[i](str, index);
        if(!currentChomp.isInvalid()) {
          response.push(currentChomp);
          isInstructionValid = true;
          index = currentChomp.index;
          break;
        }
      }

      if(!isInstructionValid) {
        break;
      }
    }

    if(index < str.length) {
      return Chomp.invalid();
    }
    let programChomp = new Chomp(null, index, Program);
    programChomp.childrenChomps = response;

    return programChomp;
  }
}
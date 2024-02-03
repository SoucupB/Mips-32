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
    let mainDeclarations = Methods.searchMethodByName(chomp, 'main');

    if(!mainDeclarations.length) {
      this.errors.push('Missing main method!');
      return false;
    }
    if(mainDeclarations.length > 1) {
      this.errors.push('Multiple main definitions!');
      return false;
    }
    if(!this.validateMethodsUniqueness(chomp)) {
      return false;
    }
    if(!this.validateStackVariables(chomp)) {
      return false;
    }

    return true;
  }

  validateMethodsUniqueness(chomp) {
    let allMethods = Methods.searchAllMethods(chomp);
    let methodNames = {};
    for(let i = 0, c = allMethods.length; i < c; i++) {
      if(!(allMethods[i].buffer in methodNames)) {
        methodNames[allMethods[i].buffer] = 0;
      }

      methodNames[allMethods[i].buffer]++;

      if(methodNames[allMethods[i].buffer] > 1) {
        this.errors.push(`Multiple methods with name ${allMethods[i].buffer} detected!`);
        return false;
      }
    }

    return true;
  }

  validateStackVariables(chomp) {
    return this.validateStackVariables_t(chomp, new StackDeclarations())
  }

  validateStackVariables_t(chomp, stackDeclaration) {
    let instructions = chomp.childrenChomps;
    for(let i = 0, c = instructions.length; i < c; i++) {
      const currentInstruction = instructions[i];
      switch(currentInstruction.type) {
        case Assignation: {
          const undefinedVariables = Assignation.findUnassignedVariables(currentInstruction, stackDeclaration);
          if(undefinedVariables.length) {
            this.errors.push(`Undefined variables ${undefinedVariables.join(',')}`);
            return false;
          }
          break;
        }
        case Initialization: {
          let variables = Initialization.addToStackAndVerify(currentInstruction, stackDeclaration);
          if(variables[0].length) {
            this.errors.push(`Undefined variables: ${variables[0].join(',')}`);
            return false;
          }
          if(variables[1].length) {
            this.errors.push(`Multiple definitions for variables: ${variables[1].join(',')}`);
            return false;
          }
          break;
        }
        case Methods: {
          let methodsDefines = Methods.addToStackAndVerify(currentInstruction, stackDeclaration);
          if(methodsDefines[0].length) {
            this.errors.push(`Undefined variables: ${methodsDefines[0].join(',')}`);
            return false;
          }
          if(methodsDefines[1].length) {
            this.errors.push(`Multiple definitions for variables: ${methodsDefines[1].join(',')}`);
            return false;
          }
          break;
        }

        default:
          break;
      }
      // iterate through instructions and find instructions that have multiple definitions.
    }
    return true;
  }

  _chomp(str, index) {
    let testingMethods = [Methods.chompDeclaration, Assignation.chomp, Initialization.chomp];
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
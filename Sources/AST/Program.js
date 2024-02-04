import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import { Methods } from "./Methods.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { StackDeclarations } from "./StackDeclarations.js";
import { Helper } from "./Helper.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";

export class Program {
  constructor(code, errors = []) {
    this.code = code;
    this.errors = errors;
  }

  chomp() {
    let chomp = this._chomp(this.code, 0);
    if(chomp.isInvalid()) {
      this.errors.push(new CompilationErrors(null, ErrorTypes.PARSE_ERROR))
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
      this.errors.push(new CompilationErrors(null, ErrorTypes.MISSING_MAIN_METHOD))
      return false;
    }
    if(mainDeclarations.length > 1) {
      this.errors.push(new CompilationErrors(null, ErrorTypes.MULTIPLE_MAIN_METHODS))
      return false;
    }
    if(!this.validateMethodsUniqueness(chomp)) {
      return false;
    }
    if(!this.validateVariableNonKeywords(chomp)) {
      return false;
    }
    if(!this.validateStackVariables(chomp)) {
      return false;
    }

    return true;
  }

  validateVariableNonKeywords(chomp) {
    let allVariableNames = Helper.searchChompByType(chomp, {
      type: Variable
    });

    const cKeywords = [
      "auto", "break", "case", "char", "const", "continue", "default", "do",
      "double", "else", "enum", "extern", "float", "for", "goto", "if", "int",
      "long", "register", "return", "short", "signed", "sizeof", "static",
      "struct", "switch", "typedef", "union", "unsigned", "void", "volatile",
      "while"
    ];

    for(let i = 0, c = allVariableNames.length; i < c; i++) {
      if(cKeywords.includes(allVariableNames[i].buffer)) {
        this.errors.push(new CompilationErrors(allVariableNames[i].buffer, ErrorTypes.PREDEFINED_VALUE));
        return false;
      }
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
        this.errors.push(new CompilationErrors(allMethods[i].buffer, ErrorTypes.METHOD_MULTIPLE_DEFINITION))
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
          const errors = Assignation.findUnassignedVariables(currentInstruction, stackDeclaration);
          if(!errors.isClean()) {
            this.errors.push(errors);
            return false;
          }
          break;
        }
        case Initialization: {
          const errors = Initialization.addToStackAndVerify(currentInstruction, stackDeclaration);
          if(!errors.isClean()) {
            this.errors.push(errors);
            return false;
          }
          break;
        }
        case Methods: {
          const errors = Methods.addToStackAndVerify(currentInstruction, stackDeclaration);
          if(!errors.isClean()) {
            this.errors.push(errors);
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
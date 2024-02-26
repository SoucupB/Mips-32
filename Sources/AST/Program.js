import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import { Methods } from "./Methods.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { StackDeclarations } from "./StackDeclarations.js";
import { Helper } from "./Helper.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";
import Character from "./Character.js";

let stddoutOutputBuffer = 2 ** 16;

export class PredefinedMethods {
  static methods() {
    return `${PredefinedMethods.getElementAt()}${PredefinedMethods.storeElement()}${PredefinedMethods.storePrint()}${PredefinedMethods.bytePrint()}`
  }

  static getElementAt() {
    return `int getElement(int buffer,int pos){return *(buffer+pos*4);}`;
  }

  static storeElement() {
    return `int setElement(int buffer,int pos,int element){*(buffer+pos*4)=element;return 0;}`;
  }

  static bytePrint() {
    return `
    int __digitCount(int n) {
      int total = 0;
      while(n) {
        n = n / 10;
        total = total + 1;
      }

      return total;
    }

    int pushCharacter(int character) {
      int stdoutBuffer = ${stddoutOutputBuffer};
      int currentOffset = *(stdoutBuffer - 4);
      *(stdoutBuffer + currentOffset) = character;
      *(stdoutBuffer - 4) = currentOffset + 1;

      return 0;
    }
    
    int printNumber_t(int element){
      if(element == 0) {
        return 0;
      }
      printNumber_t(element / 10);
      pushCharacter(element % 10 + 48);
      return 0;
    }
    
    int printNumber(int element){
      return printNumber_t(element);
    }

    int printChar(int element){
      return pushCharacter(element);
    }
    
    `;
  }

  static storePrint() {
    return `int printLine(int element){int startingPointer=${stddoutOutputBuffer};int size=*(startingPointer-4);*(startingPointer+size)=element;*(startingPointer-4)=size+4;return 0;}`;
  }
};

export class Program {
  constructor(code, errors = [], withPredefinedMethods = true) {
    if(withPredefinedMethods) {
      this.code = `${PredefinedMethods.methods()}${code}`;
    }
    else {
      this.code = code;
    }
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
    
    index = Character.pruneSpacesAndNewlines(str, index);
    if(index < str.length) {
      return Chomp.invalid();
    }
    let programChomp = new Chomp(null, index, Program);
    programChomp.childrenChomps = response;

    return programChomp;
  }
}
import Chomp from "./Chomp.js";
import { MethodVariable, Variable } from "./Variable.js";
import { MethodCall, Methods } from "./Methods.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { StackDeclarations } from "./StackDeclarations.js";
import { Helper } from "./Helper.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";
import Character from "./Character.js";
import Expression from "./Expression.js";

export class PredefinedMethods {
  static methods(stddoutOutputBuffer) {
    return `${PredefinedMethods.getElementAt()}${PredefinedMethods.storeElement()}${PredefinedMethods.storePrint(stddoutOutputBuffer)}${PredefinedMethods.bytePrint(stddoutOutputBuffer)}`
  }

  static getElementAt() {
    return `int getElement(int buffer,int pos){return *(buffer+pos*4);}`;
  }

  static storeElement() {
    return `int setElement(int buffer,int pos,int element){*(buffer+pos*4)=element;return 0;}`;
  }

  static bytePrint(stddoutOutputBuffer) {
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

    int printChar(int element){
      return pushCharacter(element);
    }
    
    int printNumber(int element){
      if(element < 0) {
        element = 0 - element;
        printChar(45);
        return printNumber_t(element);
      }
      if(element == 0) {
        printChar(48);
      }
      return printNumber_t(element);
    }
    `;
  }

  static storePrint(stddoutOutputBuffer) {
    return `int printLine(int element){int startingPointer=${stddoutOutputBuffer};int size=*(startingPointer-4);*(startingPointer+size)=element;*(startingPointer-4)=size+4;return 0;}`;
  }
};

export class Program {
  constructor(code, errors = [], withPredefinedMethods = true, stddoutOutputBuffer = 2 ** 16) {
    if(withPredefinedMethods) {
      this.code = `${PredefinedMethods.methods(stddoutOutputBuffer)}${code}`;
    }
    else {
      this.code = code;
    }
    this.errors = errors;
  }

  fillParents(chomp) {
    for(let i = 0, c = chomp.childrenChomps.length; i < c; i++) {
      chomp.childrenChomps[i].parentChomp = chomp;
      this.fillParents(chomp.childrenChomps[i]);
    }
  }

  chomp() {
    let chomp = this._chomp(this.code, 0);
    this.fillParents(chomp);
    if(chomp.isInvalid()) {
      this.errors.push(new CompilationErrors(null, ErrorTypes.PARSE_ERROR))
      return Chomp.invalid();
    }
    if(!this.validateChomp(chomp)) {
      return Chomp.invalid();
    }
    this.ignoreUnusedMethods(chomp);
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
    if(!this.validateMethodNoVariables(chomp)) {
      this.errors.push(new CompilationErrors(null, ErrorTypes.AMBIGUOS_DECLARATION))
      return false;
    }
    if(!this.validateVoidMethodsInExpressions(chomp)) {
      this.errors.push(new CompilationErrors(null, ErrorTypes.INVALID_VOID_EXPRESSION_USE))
      return false;
    }

    return true;
  }

  pairVoidMethods(chomp) {
    let voidMethods = {};

    let methods = Helper.searchChompByType(chomp, {
      type: Methods
    });
    for(let i = 0, c = methods.length; i < c; i++) {
      if(methods[i].buffer != 'main' && Methods.isMethodVoid(methods[i])) {
        voidMethods[methods[i].buffer] = 1;
      }
    }

    return voidMethods;
  }

  doesExpressionHaveMethod(expression, voidMethods) {
    let allCalls = Helper.searchChompByType(expression, {
      type: MethodCall
    });

    for(let i = 0, c = allCalls.length; i < c; i++) {
      let currentMethodName = allCalls[i].childrenChomps[0];

      if(currentMethodName.buffer in voidMethods) {
        return true;
      }
    }

    return false;
  }

  doesNodeHaveMethod(node, voidMethods) {
    let expressions = Helper.searchChompByType(node, {
      type: Expression
    });

    for(let i = 0, c = expressions.length; i < c; i++) {
      if(this.doesExpressionHaveMethod(expressions[i], voidMethods)) {
        return true;
      }
    }

    return false;
  }

  doMethodHasVoidCalls(methodCall, voidMethods) {
    let methodCalls = Helper.searchChompByType(methodCall, {
      type: MethodCall
    });
    for(let i = 0, c = methodCalls.length; i < c; i++) {
      let currentMethodName = methodCalls[i].childrenChomps[0];
      if(currentMethodName.buffer in voidMethods) {
        return true;
      }
    }
    return false;
  }

  // check if the expression has only one operand
  expressionsVoidMethods(chomp, voidMethods) {
    let methodCalls = Helper.searchChompByType(chomp, {
      type: MethodCall
    });

    for(let i = 0, c = methodCalls.length; i < c; i++) {
      let currentMethodName = methodCalls[i].childrenChomps[0];
      if((currentMethodName.buffer in voidMethods && methodCalls[i].parentChomp.childrenChomps.length > 1) || this.doMethodHasVoidCalls(methodCalls[i].childrenChomps[1], voidMethods)) {
        return false;
      }
    }

    return true;
  }

  validateVoidMethodsInExpressions(chomp) {
    let voidMethods = this.pairVoidMethods(chomp);

    let initializations = Helper.searchChompByType(chomp, {
      type: Initialization
    });

    for(let i = 0, c = initializations.length; i < c; i++) {
      if(this.doesNodeHaveMethod(initializations[i], voidMethods)) {
        return false;
      }
    }

    let assignations = Helper.searchChompByType(chomp, {
      type: Assignation
    });

    for(let i = 0, c = assignations.length; i < c; i++) {
      if(this.doesNodeHaveMethod(assignations[i], voidMethods)) {
        return false;
      }
    }

    if(!this.expressionsVoidMethods(chomp, voidMethods)) {
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

  ignoreUnusedMethods_t(currentMethodName, methodsPairs, usedMethods) {
    const currentMethod = methodsPairs[currentMethodName];

    let methodCalls = Helper.searchChompByType(currentMethod, {
      type: MethodCall,
    });

    for(let i = 0, c = methodCalls.length; i < c; i++) {
      const currentMethodCall = methodCalls[i].childrenChomps[0].buffer;

      if(!(currentMethodCall in usedMethods)) {
        usedMethods[currentMethodCall] = 1;
        this.ignoreUnusedMethods_t(currentMethodCall, methodsPairs, usedMethods);
      }
    }
  }

  pairMethodsWithNames(chomp) {
    let methodsReferences = {};
    let allMethods = Helper.searchChompByType(chomp, {
      type: Methods,
    });
    for(let i = 0, c = allMethods.length; i < c; i++) {
      methodsReferences[Methods.methodName(allMethods[i])] = allMethods[i];
    }

    return methodsReferences;
  }

  ignoreUnusedMethods(chomp) {
    let methodsPairs = this.pairMethodsWithNames(chomp);
    let usedMethods = {
      'main': 1
    };

    this.ignoreUnusedMethods_t('main', methodsPairs, usedMethods);
    for(const [key, value] of Object.entries(methodsPairs)) {
      if(!(key in usedMethods)) {
        value.ignore = true;
      }
    }
  }

  compilationError() {
    return this.errors.length == 0;
  }

  errorsToString() {
    let stringErrors = [];
    for(let i = 0, c = this.errors.length; i < c; i++) {
      stringErrors.push(this.errors[i].toString());
    }

    return stringErrors.join(', ')
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

  validateMethodNoVariables(chomp) {
    let allMethods = Methods.searchAllMethods(chomp);
    let allVariables = Helper.searchChompByType(chomp, {
      type: Variable
    });
    let variableNames = {};

    for(let i = 0, c = allVariables.length; i < c; i++) {
      variableNames[allVariables[i].buffer] = 1;
    }

    for(let i = 0, c = allMethods.length; i < c; i++) {
      if(allMethods[i].buffer in variableNames) {
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
    let testingMethods = [Methods.chompDeclaration];
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
    Methods.addDefaultReturnsForVoidMethods(programChomp);

    return programChomp;
  }
}
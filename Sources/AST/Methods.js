import Chomp from "./Chomp.js";
import { MethodVariable, Variable } from "./Variable.js";
import Character from "./Character.js";
import { MethodsParams } from "./MethodsParam.js";
import { CodeBlock } from "./CodeBlock.js";
import Operator from "./Operator.js";
import Expression from "./Expression.js";
import { Helper } from "./Helper.js";
import { CompilationErrors, ErrorTypes } from "./CompilationErrors.js";

export class MethodsKeywords {
  static keyWords() {
    return ['int', 'void', 'char'];
  }
}

export class MethodCall {
  static findUnassignedVariables(chomp, stackDeclaration) {
    let children = chomp.childrenChomps;

    let params = children[1].childrenChomps;

    for(let i = 0, c = params.length; i < c; i++) {
      let paramsUndefinedVariables = Expression.checkStackInitialization(params[i], stackDeclaration);
      if(!paramsUndefinedVariables.isClean()) {
        return paramsUndefinedVariables;
      }
    }

    return CompilationErrors.clean();
  }

  static doesMethodHaveAllTheParametersPresent(chomp, stackDeclaration) {
    let children = chomp.childrenChomps;

    let methodName = children[0].buffer;
    let params = children[1].childrenChomps;

    const paramsCalled = stackDeclaration.getArgsFromMethodName(methodName);
    if(paramsCalled && paramsCalled.length == params.length) {
      return false;
    }

    return true;
  }
}

export class MethodDefinitionAndName {

}

export class ReturnWithExpression {

}

export class ReturnWithoutExpression {

}

export class ReturnMethod {
  static keyWords() {
    return ['return']
  }

  static chompReturnWithExpression(str, index) {
    let expression = Expression.chomp(str, index);
    if(expression.isInvalid()) {
      return Chomp.invalid();
    }
    index = expression.index;
    index = Character.pruneSpacesAndNewlines(str, index);
    if(index >= str.length || !Character.isAssignationEnding(str[index])) {
      return Chomp.invalid();
    }
    index++;

    let responseChomp = new Chomp(null, index, ReturnWithExpression);
    responseChomp.childrenChomps = [expression];

    return responseChomp;
  }

  static chompReturnWithoutExpression(str, index) {
    index = Character.pruneSpacesAndNewlines(str, index);
    if(index >= str.length || !Character.isAssignationEnding(str[index])) {
      return Chomp.invalid();
    }
    index++;

    let responseChomp = new Chomp(null, index, ReturnWithoutExpression);
    responseChomp.childrenChomps = [];

    return responseChomp;
  }

  static chomp(str, index, withExpression = true) {
    let returnKeyword = ReturnMethod.chompKeywordsInitialization(str, index);
    if(returnKeyword.isInvalid()) {
      return Chomp.invalid();
    }
    index = returnKeyword.index;
    if(index >= str.length || !Character.isSeparator(str[index])) {
      return Chomp.invalid();
    }
    index++;

    const returnWithExpression = ReturnMethod.chompReturnWithExpression(str, index);
    if(!returnWithExpression.isInvalid()) {
      return returnWithExpression;
    }
    const returnWithoutExpression = ReturnMethod.chompReturnWithoutExpression(str, index);
    if(!returnWithoutExpression.isInvalid()) {
      return returnWithoutExpression;
    }

    return Chomp.invalid();
  }

  static chompKeywordsInitialization(str, index) {
    index = Character.pruneSpacesAndNewlines(str, index);
    let keywords = ReturnMethod.keyWords();
    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i], index) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, MethodsKeywords)
      }
    }

    return Chomp.invalid();
  }

  static addToStackAndVerify(chomp, stackDeclaration) {
    const expression = chomp.childrenChomps[0];

    return Expression.checkStackInitialization(expression, stackDeclaration);
  }
}

export class Methods {
  static chompDeclaration(str, index) {
    let methodDeclaration = Methods.methodHeaderDeclaration(str, index);
    if(methodDeclaration.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodDeclaration.index;

    let openParanth = Operator.chompOpenParanth(str, index);
    if(openParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = openParanth.index;

    let methodParams = Methods.chompMethodDeclarationsAnthetParams(str, index);
    if(methodParams.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodParams.index;

    let closeParanth = Operator.chompCloseParanth(str, index);
    if(closeParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = closeParanth.index;

    let methodBlock = CodeBlock.chomp(str, index, true);
    if(methodBlock.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodBlock.index;

    let chompResponse = new Chomp(methodDeclaration.buffer, index, Methods);
    chompResponse.childrenChomps = [methodDeclaration, methodParams, methodBlock];

    return chompResponse;
  }

  static chompMethodCall(str, index) {
    let methodName = MethodVariable.chomp(str, index);
    if(methodName.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodName.index;

    let openParanth = Operator.chompOpenParanth(str, index);
    if(openParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = openParanth.index;

    let params = Methods.chompMethodParameters(str, index);
    if(params.isInvalid()) {
      return Chomp.invalid();
    }
    index = params.index;

    let closeParanth = Operator.chompCloseParanth(str, index);
    if(closeParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = closeParanth.index;

    let chomp = new Chomp(null, index, MethodCall)
    chomp.childrenChomps = [methodName, params];

    return chomp;
  }

  static chompKeywordsInitialization(str, index) {
    index = Character.pruneSpacesAndNewlines(str, index);
    let keywords = MethodsKeywords.keyWords();
    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i], index) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, MethodsKeywords)
      }
    }

    return Chomp.invalid();
  }

  static chompMethodParameters(str, index) {
    let expressions = [];
    let hasParameters = false;
    while(index < str.length) {
      let expression = Expression.chomp(str, index);
      let isInvalid = expression.isInvalid();

      if(!hasParameters && isInvalid) {
        return Methods.arrayToChomp(expressions, index);
      }
      if(isInvalid) {
        return Chomp.invalid();
      }

      hasParameters = true;
      index = expression.index;
      expressions.push(expression);

      index = Character.pruneSpacesAndNewlines(str, index);

      if(index >= str.length || !Character.isCommaSeparator(str[index])) {
        return Methods.arrayToChomp(expressions, index);
      }
      index++;
    }

    return Methods.arrayToChomp(expressions, index);
  }

  static methodHeaderDeclaration(str, index) {
    let methodType = Methods.chompKeywordsInitialization(str, index);
    if(methodType.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodType.index;

    if(index >= str.length || !Character.isSeparator(str[index])) {
      return Chomp.invalid();
    }
    index++;

    let methodName = MethodVariable.chomp(str, index);
    if(methodName.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodName.index;

    let chomp = new Chomp(methodName.buffer, index, MethodDefinitionAndName);
    chomp.childrenChomps = [methodType, methodName];

    return chomp;
  }

  static methodName(chomp) {
    if(chomp.type != Methods) {
      return null;
    }

    return chomp.childrenChomps[0].buffer;
  }

  static arrayToChomp(arr, index) {
    let chomp = new Chomp(null, index);
    chomp.childrenChomps = arr;

    return chomp;
  }

  static chompMethodDeclarationsAnthetParams(str, index) {
    let params = [];
    let firstParamPresence = false;

    while(index < str.length) {
      let currentParamDeclaration = MethodsParams.chomp(str, index);
      if(!firstParamPresence && currentParamDeclaration.isInvalid()) {
        return Methods.arrayToChomp(params, index);
      }
      params.push(currentParamDeclaration);
      index = currentParamDeclaration.index;
      firstParamPresence = true;

      if(index >= str.length || !Character.isCommaSeparator(str[index])) {
        return Methods.arrayToChomp(params, index);
      }
      index++;
    }

    return Methods.arrayToChomp(params, index);
  }

  static searchMethodByName(chomp, name) {
    return Helper.searchChompByType(chomp, {
      buffer: name,
      type: Methods
    });
  }

  static searchAllMethods(chomp) {
    return Helper.searchChompByType(chomp, {
      type: Methods
    });
  }

  static pushMethodParams(methodName, methodParams, stackDeclaration) {
    const params = methodParams.childrenChomps;
    let paramsVariables = [];

    for(let i = 0, c = params.length; i < c; i++) {
      const varType = params[i].childrenChomps[0];
      const varName = params[i].childrenChomps[1];
      paramsVariables.push({
        type: varType,
        name: varName
      });
    }
    stackDeclaration.pushMethod(methodName, paramsVariables);

    return ;
  }

  static checkParamsAndPush(methodParams, stackDeclaration) {
    const params = methodParams.childrenChomps;
    let alreadyDefinedVariables = [];

    for(let i = 0, c = params.length; i < c; i++) {
      const varName = params[i].childrenChomps[1].buffer;

      if(stackDeclaration.isVariableDefined(varName)) {
        alreadyDefinedVariables.push(varName);
      }
    }

    return alreadyDefinedVariables;
  }

  static pushParams(methodParams, stackDeclaration) {
    const params = methodParams.childrenChomps;
    for(let i = 0, c = params.length; i < c; i++) {
      const varName = params[i].childrenChomps[1];
      stackDeclaration.push(varName.buffer);
    }
  }

  static doesReturnNeedsToBeNonVoid(block) {
    const expressionReturns = Helper.searchChompByType(block, {
      type: ReturnWithExpression
    });
    const woExpressionReturns = Helper.searchChompByType(block, {
      type: ReturnWithoutExpression
    });

    if(expressionReturns.length && !woExpressionReturns.length) {
      return true;
    }

    return false
  }

  static doesReturnNeedsToBeVoid(block) {
    const expressionReturns = Helper.searchChompByType(block, {
      type: ReturnWithExpression
    });

    if(expressionReturns.length) {
      return false;
    }

    return true;
  }

  static doesReturnNeedsToBe(methodReturnType, block) {
    if(methodReturnType == 'void') {
      return Methods.doesReturnNeedsToBeVoid(block);
    }
    if(methodReturnType != 'void') {
      return Methods.doesReturnNeedsToBeNonVoid(block);
    }
    return true;
  }

  static isMethodVoid(chomp) {
    let header = chomp.childrenChomps[0];
    let methods = Helper.searchChompByType(header, {
      type: MethodsKeywords
    });

    return methods[0].buffer == 'void';
  }

  static addDefaultReturn(method) {
    let block = method.childrenChomps[2];
    block.childrenChomps.push(new Chomp(null, 0, ReturnWithoutExpression));
  }

  static addDefaultReturnsForVoidMethods(chomp) {
    let methods = Helper.searchChompByType(chomp, {
      type: Methods
    });
    for(let i = 0, c = methods.length; i < c; i++) {
      if(methods[i].buffer != 'main' && Methods.isMethodVoid(methods[i])) {
        Methods.addDefaultReturn(methods[i]);
      }
    }

  }

  static addToStackAndVerify(chomp, stackDeclaration) {
    let children = chomp.childrenChomps;

    const methodHeader = children[0];
    const methodParams = children[1];
    const block = children[2];

    const methodName = methodHeader.childrenChomps[1];
    const methodType = methodHeader.childrenChomps[0].buffer;
    
    if(stackDeclaration.isMethodDefined(methodName.buffer) || stackDeclaration.isVariableDefined(methodName.buffer)) {
      return new CompilationErrors([methodName.buffer], ErrorTypes.VARIABLE_MULTIPLE_DEFINITION);
    }

    let alreadyDefinedVariables = Methods.checkParamsAndPush(methodParams, stackDeclaration);
    if(alreadyDefinedVariables.length) {
      return new CompilationErrors(alreadyDefinedVariables, ErrorTypes.VARIABLE_MULTIPLE_DEFINITION);
    }
    if(!Methods.doesReturnNeedsToBe(methodType, block)) {
      return new CompilationErrors(null, ErrorTypes.INVALID_RETURN);
    }

    Methods.pushMethodParams(methodName.buffer, methodParams, stackDeclaration);
    stackDeclaration.freeze();
    Methods.pushParams(methodParams, stackDeclaration);

    let blockVariables = CodeBlock.addToStackAndVerify(block, stackDeclaration);
    if(!blockVariables.isClean()) {
      return blockVariables;
    }
    stackDeclaration.pop();

    return CompilationErrors.clean();
  }
}
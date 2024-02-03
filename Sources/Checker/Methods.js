import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Character from "./Character.js";
import { MethodsParams } from "./MethodsParam.js";
import { CodeBlock } from "./CodeBlock.js";
import Operator from "./Operator.js";
import Expression from "./Expression.js";
import { Helper } from "./Helper.js";

export class MethodsKeywords {
  static keyWords() {
    return ['int', 'void', 'char'];
  }
}

export class MethodCall {

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

    let methodBlock = CodeBlock.chomp(str, index);
    if(methodBlock.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodBlock.index;

    let chompResponse = new Chomp(methodDeclaration.buffer, index, Methods);
    chompResponse.childrenChomps = [methodDeclaration, methodParams, methodBlock];

    return chompResponse;
  }

  static chompMethodCall(str, index) {
    let methodName = Variable.chomp(str, index);
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

    let methodName = Variable.chomp(str, index);
    if(methodName.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodName.index;

    let chomp = new Chomp(methodName.buffer, index, null);
    chomp.childrenChomps = [methodType];

    return chomp;
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
}
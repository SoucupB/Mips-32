import Chomp from "./Chomp.js";
import Variable from "./Variable.js";
import Character from "./Character.js";

export class MethodsKeywords {
  static keyWords() {
    return ['int', 'void', 'char'];
  }
}

export class Methods {
  static chompDeclaration(str, index) {
    let methodDeclaration = Methods.methodHeaderDeclaration(str, index);
    if(methodDeclaration.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodDeclaration.index;

    let openParanth = Methods.chompOpenParanth(str, index);
    if(openParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = openParanth.index;

    let methodParams = Methods.chompMethodDeclarationsAnthetParams(str, index);
    if(methodParams.isInvalid()) {
      return Chomp.invalid();
    }
    index = methodParams.index;

    let closeParanth = Methods.chompCloseParanth(str, index);
    if(closeParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = closeParanth.index;
    // ...

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

    let variable = Variable.chomp(str, index);
    if(variable.isInvalid()) {
      return Chomp.invalid();
    }
    index = variable.index;

    let chomp = new Chomp(null, index, null);
    chomp.childrenChomps = [methodType, variable];

    return chomp;
  }

  static chompMethodDeclarationsAnthetParams(str, index) {

  }
}
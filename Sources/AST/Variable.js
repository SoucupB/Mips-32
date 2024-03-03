import Character from "./Character.js";
import Chomp from "./Chomp.js";

export class MethodVariable {
  static chomp(str, index) {
    let variableChomp = Variable.chomp(str, index);
    if(variableChomp.isInvalid()) {
      return Chomp.invalid();
    }

    variableChomp.type = MethodVariable;
    return variableChomp;
  }
}

export class Variable {
  static isValid(str) {
    if(!str.length) {
      return false;
    }

    if(Character.isNumeric(str[0])) {
      return false;
    }

    for(let i = 0, c = str.length; i < c; i++) {
      if(!(Character.isAlpha(str[i]) || Character.isNumeric(str[i]) || str[i] == '_')) {
        return false;
      }
    }

    return true;
  }

  static isKeyword(buffer) {
    const cKeywords = [
      "auto", "break", "case", "char", "const", "continue", "default", "do",
      "double", "else", "enum", "extern", "float", "for", "goto", "if", "int",
      "long", "register", "return", "short", "signed", "sizeof", "static",
      "struct", "switch", "typedef", "union", "unsigned", "void", "volatile",
      "while"
    ];

    if(cKeywords.includes(buffer)) {
      return true;
    }

    return false;
  }

  static chomp(str, index) {
    if(!str || !str.length || Character.isNumeric(str[index])) {
      return Chomp.invalid();
    }

    let i = Character.pruneSpacesAndNewlines(str, index);
    let result = "";

    while(i < str.length && (Character.isAlpha(str[i]) || Character.isNumeric(str[i]) || str[i] == '_')) {
      result += str[i++];
    }
    if(!result.length) {
      return Chomp.invalid();
    }
    if(Variable.isKeyword(result)) {
      return Chomp.invalid();
    }

    return new Chomp(result, i, Variable);
  }
}
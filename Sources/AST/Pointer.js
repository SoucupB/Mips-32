import Character from "./Character.js";
import Chomp from "./Chomp.js";

export class Pointer {
  static chomp(str, index) {
    if(!str || index >= str.length) {
      return Chomp.invalid();
    }

    if(str[index] != '*') {
      return Chomp.invalid();
    }
    index++;


  }

  static chompExpressionInParanthesys(str, index) {
    
  }
}
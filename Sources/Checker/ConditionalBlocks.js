import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import { CodeBlock } from "./CodeBlock.js";
import Expression from "./Expression.js";

export class ConditionalKeywords {
  static keyWords() {
    return ['if'];
  }
}

export class ConditionalBlocks {
  // [0] -> expression, [1] -> block

  static chomp(str, index) {
    let conditionalBlock = ConditionalBlocks.chompKeywordsInitialization(str, index);
    if(conditionalBlock.isInvalid()) {
      return Chomp.invalid();
    }
    index = conditionalBlock.index;

    let openParanth = Operator.chompOpenParanth(str, index);
    if(openParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = openParanth.index;

    let expression = Expression.chomp(str, index);
    if(expression.isInvalid()) {
      return Chomp.invalid();
    }
    index = expression.index;

    let closeParanth = Operator.chompCloseParanth(str, index);
    if(closeParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = closeParanth.index;

    let block = CodeBlock.chomp(str, index);
    if(block.isInvalid()) {
      return Chomp.invalid();
    }
    index = block.index;
    let responseChomp = new Chomp(null, index, ConditionalBlocks)
    responseChomp.childrenChomps = [conditionalBlock, expression];
    return responseChomp;
  }

  static chompKeywordsInitialization(str, index) {
    let keywords = ConditionalKeywords.keyWords();
    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i], index) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, ConditionalKeywords)
      }
    }

    return Chomp.invalid();
  }
}
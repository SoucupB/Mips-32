import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import { CodeBlock } from "./CodeBlock.js";
import Expression from "./Expression.js";

export class LoopKeywords {
  static keyWords() {
    return ['while', 'for'];
  }
}

export class LoopBlocks {
  static chomp(str, index) {
    let loopBlock = LoopBlocks.chompKeywordsInitialization(str, index);
    if(loopBlock.isInvalid()) {
      return Chomp.invalid();
    }
    index = loopBlock.index;
    if(loopBlock.buffer == 'while') {
      return LoopBlocks.chompWhileBlock(str, index);
    }
    if(loopBlock.buffer == 'for') {
      return Chomp.invalid();
    }

    return Chomp.invalid();
  }

  static chompKeywordsInitialization(str, index) {
    let keywords = LoopKeywords.keyWords();
    for(let i = 0, c = keywords.length; i < c; i++) {
      if(str.indexOf(keywords[i], index) == index) {
        return new Chomp(keywords[i], index + keywords[i].length, LoopKeywords)
      }
    }

    return Chomp.invalid();
  }

  static chompWhileBlock(str, index) {
    let openParanth = Operator.chompOpenParanth(str, index);
    if(openParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = openParanth.index;
    let expressionChecker = Expression.chomp(str, index);
    if(expressionChecker.isInvalid()) {
      return Chomp.invalid();
    }
    index = expressionChecker.index;
    let closeParanth = Operator.chompCloseParanth(str, index);
    if(closeParanth.isInvalid()) {
      return Chomp.invalid();
    }
    index = closeParanth.index;

    let blockChomp = CodeBlock.chomp(str, index);
    if(blockChomp.isInvalid()) {
      return Chomp.invalid();
    }
    index = blockChomp.index;

    let loopChomp = new Chomp('while', index, LoopBlocks);
    loopChomp.childrenChomps = [expressionChecker, blockChomp];

    return loopChomp;
  }
}
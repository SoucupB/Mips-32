import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { LoopBlocks } from "./LoopBlocks.js";
import { ConditionalBlocks } from "./ConditionalBlocks.js";

export class CodeBlock {
  static chomp(str, index) {
    let openBracket = Operator.chompOpenBracket(str, index);
    if(openBracket.isInvalid()) {
      return Chomp.invalid();
    }
    index = openBracket.index;
    let blockList = CodeBlock.chompBlock(str, index);
    index = blockList.index;
    let closedBracket = Operator.chompCloseBracket(str, index);
    if(closedBracket.isInvalid()) {
      return Chomp.invalid();
    }
    let responseChomp = new Chomp(null, index + 1, CodeBlock);
    responseChomp.childrenChomps = blockList.childrenChomps;
    return responseChomp;
  }

  static chompBlock(str, index) {
    let availableBlocks = [Assignation.chomp, Initialization.chomp, CodeBlock.chomp, LoopBlocks.chomp, ConditionalBlocks.chomp];
    let responseBlocks = [];
    while(index < str.length) {
      let hasLineBeenProcessed = false;
      for(let i = 0; i < availableBlocks.length; i++) {
        let chomp = availableBlocks[i](str, index);
        if(!chomp.isInvalid()) {
          index = chomp.index;
          hasLineBeenProcessed = true;
          responseBlocks.push(chomp);
          break;
        }
      }
      if(!hasLineBeenProcessed) {
        break;
      }
    }

    let responseChomp = new Chomp(null, index, CodeBlock);
    responseChomp.childrenChomps = responseBlocks;
    return responseChomp;
  }
}
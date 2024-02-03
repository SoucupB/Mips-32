import Operator from "./Operator.js";
import Chomp from "./Chomp.js";
import { Assignation } from "./Assignation.js";
import { Initialization } from "./Initialization.js";
import { LoopBlocks } from "./LoopBlocks.js";
import { ConditionalBlocks } from "./ConditionalBlocks.js";
import { StackDeclarations } from "./StackDeclarations.js";

export class CodeBlock {
  // [0] -> assignation/init/while/for/if, [1] -> assignation/init/while/for/if, .... 

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

  static addToStackAndVerify_t(chomp, stackDeclaration) {
    let children = chomp.childrenChomps;
    for(let i = 0, c = children.length; i < c; i++) {
      let currentChild = children[i];
      switch(currentChild.type) {
        case Assignation: {
          let response = Assignation.findUnassignedVariables(currentChild, stackDeclaration);
          if(response.length) {
            return [response, []]
          }
          break;
        }
        case Initialization: {
          let response = Initialization.addToStackAndVerify(currentChild, stackDeclaration);
          // If there are either undefined or multiple definitions.
          if(response[0].length || response[1].length) {
            return response;
          }
          break;
        }
        case CodeBlock: {
          let codeBlockResponse = CodeBlock.addToStackAndVerify(currentChild, stackDeclaration);
          if(codeBlockResponse[0].length || codeBlockResponse[1].length) {
            return codeBlockResponse;
          }
          break;
        }
        case LoopBlocks: {

        }
        case ConditionalBlocks: {

        }

        default: {
          break;
        }
      }
    }
  }

  static addToStackAndVerify(chomp, stackDeclaration) {
    StackDeclarations.freeze();
    let response = CodeBlock.addToStackAndVerify_t(chomp, stackDeclaration);
    StackDeclarations.pop();
    return response;
  }
}
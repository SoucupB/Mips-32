import { Assignation } from "../AST/Assignation.js";
import Expression from "../AST/Expression.js";
import { Helper } from "../AST/Helper.js";
import { Initialization } from "../AST/Initialization.js";
import { ExpressionTree } from "./ExpressionTree.js";
import { Mov, MovTypes, Push, RegisterBlock } from "./Register.js";
import { RegisterMem } from "./RegisterMem.js";
import { RegisterStack } from "./RegisterStack.js";

export class Compiler {
  constructor(ast) {
    this.ast = ast;
    this.registerMem = new RegisterMem();
    this.registerStack = new RegisterStack();
  }

  buildExpressionTrees(chomp) {
    let allExpressions = Helper.searchChompByType(chomp, {
      type: Expression
    });

    for(let i = 0, c = allExpressions.length; i < c; i++) {
      let expression = new ExpressionTree(allExpressions[i]);
      expression.build();
      allExpressions[i].expressionTree = expression;
    }
  }

  createExpressionAsm(expressionChomp, block) {
    expressionChomp.expressionTree.addInstructionToBlock(block, this.registerMem, this.registerStack);
  }

  saveExpressionResult(expressionChomp, block) {
    const topRegister = this.registerMem.registerFromID(expressionChomp.expressionTree.root.nodeID);
    block.push(new Push(topRegister));
    this.registerMem.freeRegister(topRegister);
  }

  createInitialization(chomp) {
    const children = chomp.childrenChomps;
    let block = new RegisterBlock();
    for(let i = 1, c = children.length; i < c; i++) {
      const declaration = children[i];

      const variableName = declaration.childrenChomps[0];
      const expressionChomp = declaration.childrenChomps[1];

      this.createExpressionAsm(expressionChomp, block);
      this.registerStack.push(variableName.buffer, 4);
      this.saveExpressionResult(expressionChomp, block);
    }
    return block;
  }

  createBlock(chomp) {
    let block = new RegisterBlock();
    this.buildExpressionTrees(chomp);

    switch(chomp.type) {
      case Assignation: {
        break;
      }
      case Initialization: {
        block.push(this.createInitialization(chomp))
        break;
      }
      default: {
        break;
      }
    }
    return block;
  }

  compile() {
  }
}
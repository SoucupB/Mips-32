import { Assignation } from "../AST/Assignation.js";
import Expression from "../AST/Expression.js";
import { Helper } from "../AST/Helper.js";
import { Initialization } from "../AST/Initialization.js";
import { ExpressionTree } from "./ExpressionTree.js";
import { RegisterBlock } from "./Register.js";
import { RegisterMem } from "./RegisterMem.js";
import { RegisterStack } from "./RegisterStack.js";

export class Compiler {
  constructor(ast) {
    this.ast = ast;
    this.registerMem = new RegisterMem();
    this.registerStack = new RegisterStack();
  }

  buildExpressionTrees() {
    let allExpressions = Helper.searchChompByType(this.ast, {
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

  createInitialization(chomp) {
    const children = chomp.childrenChomps;
    let block = new RegisterBlock();

    // first param is the type and the rest are tuples...
    for(let i = 1, c = children.length; i < c; i++) {
      const declaration = children[i];

      const variableName = children[i].childrenChomps[0];
      const expression = children[i].childrenChomps[1];

      this.createExpressionAsm(expression, block);
    }

    return block;
  }

  createBlock(chomp) {
    let block = new RegisterBlock();

    switch(chomp.type) {
      case Assignation: {
        break;
      }
      case Initialization: {
        this.block(this.createInitializationBlock(chomp))
        break;
      }
      default: {
        break;
      }
    }

    return block;
  }

  compile() {
    this.buildExpressionTrees();
  }
}
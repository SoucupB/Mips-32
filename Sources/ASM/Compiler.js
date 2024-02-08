import { Assignation } from "../AST/Assignation.js";
import { CodeBlock } from "../AST/CodeBlock.js";
import Expression from "../AST/Expression.js";
import { Helper } from "../AST/Helper.js";
import { Initialization } from "../AST/Initialization.js";
import { LoopBlocks } from "../AST/LoopBlocks.js";
import { ExpressionTree } from "./ExpressionTree.js";
import { Jmp, Jz, Label, Mov, MovTypes, Pop, Push, RegisterBlock, Test } from "./Register.js";
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

  loadExpressionOnStack(expressionChomp, assignerName, block) {
    const topRegister = this.getExpressionRegister(expressionChomp);
    const stackPointerForVariable = this.registerStack.getStackOffset(assignerName.buffer)

    block.push(new Mov(stackPointerForVariable, topRegister, MovTypes.REG_TO_STACK));
    this.registerMem.freeRegister(topRegister);
  }

  compileInitialization(chomp) {
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

  compileAssignation(chomp) {
    const children = chomp.childrenChomps;
    let block = new RegisterBlock();
    this.createExpressionAsm(children[1], block);
    this.loadExpressionOnStack(children[1], children[0], block);
    return block;
  }

  popStackValues(block) {
    const popValue = this.registerStack.getFreezeTopDiff();

    if(popValue) {
      block.push(new Pop(popValue));
    }
  }

  getExpressionRegister(expressionChomp) {
    return this.registerMem.registerFromID(expressionChomp.expressionTree.root.nodeID);
  }

  _generateRandomString(length = 4) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }

  compileWhile(child) {
    let block = new RegisterBlock();
    const children = child.childrenChomps;

    let expressionChompTester = children[0];
    let codeBlock = children[1];
    const jumpBackLabel = `_label${this._generateRandomString()}`;
    block.push(new Label(jumpBackLabel))
    this.createExpressionAsm(expressionChompTester, block);
    const responseRegister = this.getExpressionRegister(expressionChompTester);
    const jumpOverLabel = `_label${this._generateRandomString()}`;
    block.push(new Test(responseRegister, responseRegister));
    block.push(new Jz(jumpOverLabel));
    block.push(this.compileBlock(codeBlock))
    block.push(new Jmp(jumpBackLabel));
    block.push(new Label(jumpOverLabel))
    return block;
  }

  compileLoop(child) {
    switch(child.buffer) {
      case 'while': {
        return this.compileWhile(child);
      }
      case 'for': {
        break;
      }
    }
    
    return new RegisterBlock();
  }

  compileBlock(chomp) {
    let block = new RegisterBlock();
    this.buildExpressionTrees(chomp);
    const children = chomp.childrenChomps;

    this.registerStack.freeze();
    for(let i = 0, c = children.length; i < c; i++) {
      const child = children[i];

      switch(child.type) {
        case Assignation: {
          block.push(this.compileAssignation(child));
          break;
        }
        case Initialization: {
          block.push(this.compileInitialization(child))
          break;
        }
        case CodeBlock: {
          block.push(this.compileBlock(child))
          break;
        }
        case LoopBlocks: {
          block.push(this.compileLoop(child))
          break;
        }
        default: {
          break;
        }
      }
    }
    this.popStackValues(block);
    this.registerStack.pop();
    return block;
  }

  compile() {
  }
}
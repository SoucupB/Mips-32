import { Assignation } from "../AST/Assignation.js";
import { CodeBlock } from "../AST/CodeBlock.js";
import { ConditionalBlocks } from "../AST/ConditionalBlocks.js";
import Expression from "../AST/Expression.js";
import { Helper } from "../AST/Helper.js";
import { Initialization } from "../AST/Initialization.js";
import { LoopBlocks } from "../AST/LoopBlocks.js";
import { Methods, ReturnWithExpression, ReturnWithoutExpression } from "../AST/Methods.js";
import { Pointer } from "../AST/Pointer.js";
import { ExpressionReturnTypes, ExpressionTree } from "./ExpressionTree.js";
import { Jmp, JmpTypes, Jz, Label, Mov, MovTypes, Pop, Push, RegisterBlock, Test } from "./Register.js";
import { RegisterMem } from "./RegisterMem.js";
import { RegisterStack } from "./RegisterStack.js";

export class Compiler {
  constructor(ast) {
    this.ast = ast;
    this.registerMem = new RegisterMem();
    this.registerStack = new RegisterStack();
    this.globalStack = new RegisterStack();

    this.labelID = 0;
    this.assignationID = 0;
  }

  buildExpressionTrees(chomp) {
    let allExpressions = Helper.searchChompByType(chomp, {
      type: Expression
    });

    for(let i = 0, c = allExpressions.length; i < c; i++) {
      let expression = new ExpressionTree(allExpressions[i]);
      if(!allExpressions[i].expressionTree) {
        expression.build();
        allExpressions[i].expressionTree = expression;
      }
    }
  }

  createExpressionAsm(expressionChomp, block, type = ExpressionReturnTypes.REGISTER) {
    expressionChomp.expressionTree.addInstructionToBlockWithOrder(block, this.registerMem, this.registerStack, type);
  }

  saveExpressionResult(expressionChomp, block) {
    const topRegister = expressionChomp.expressionTree.root.register;
    block.push(new Push(topRegister));
    this.registerMem.freeRegister(topRegister);
  }

  loadVariableInStack(expressionChomp, assigner, block) {
    this.createExpressionAsm(expressionChomp, block);
    const topRegister = this.getExpressionRegister(expressionChomp);
    const stackPointerForVariable = this.registerStack.getStackOffset(assigner.buffer)

    block.push(new Mov(stackPointerForVariable, topRegister, MovTypes.REG_TO_STACK));
    this.registerMem.freeRegister(topRegister);
  }

  getExpressionStackPoint(expression) {
    return this.registerStack.getStackOffset(expression.expressionTree.root.nodeID);
  }

  loadPointerInStack(expressionChomp, assignerExpression, block) {
    this.registerStack.freeze();
    this.createExpressionAsm(expressionChomp, block, ExpressionReturnTypes.STACK_OFFSET);
    this.createExpressionAsm(assignerExpression, block, ExpressionReturnTypes.STACK_OFFSET);
    
    let left = this.registerMem.findUnusedRegister();
    this.registerMem.saveRegisterID(left, `assignation-id-${this.assignationID++}`);
    let right = this.registerMem.findUnusedRegister();
    this.registerMem.saveRegisterID(right, `assignation-id-${this.assignationID++}`);

    block.push(new Mov(right, this.getExpressionStackPoint(assignerExpression), MovTypes.STACK_TO_REG));
    block.push(new Mov(left, this.getExpressionStackPoint(expressionChomp), MovTypes.STACK_TO_REG));
    block.push(new Mov(right, left, MovTypes.REG_TO_MEM_REG));
    block.push(new Pop(this.registerStack.getFreezeTopDiff()));

    this.registerMem.freeRegister(left);
    this.registerMem.freeRegister(right);
    this.registerStack.pop();
  }

  loadExpressionOnStack(expressionChomp, assigner, block) {
    switch(assigner.type) {
      case Pointer: {
        this.loadPointerInStack(expressionChomp, assigner.childrenChomps[0], block);
        break;
      }

      default: {
        this.loadVariableInStack(expressionChomp, assigner, block);
        break;
      }
    }
  }

  compileInitialization(chomp, memoryRegion = this.registerStack) {
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
    const expression = children[1];
    const assigner = children[0];

    this.loadExpressionOnStack(expression, assigner, block);
    return block;
  }

  popStackValues(block) {
    const popValue = this.registerStack.getFreezeTopDiff();

    if(popValue) {
      block.push(new Pop(popValue));
    }
  }

  getExpressionRegister(expressionChomp) {
    return expressionChomp.expressionTree.root.register;
  }

  nextLabel() {
    return this.labelID++;
  }

  compileWhile(child) {
    let block = new RegisterBlock();
    const children = child.childrenChomps;

    let expressionChompTester = children[0];
    let codeBlock = children[1];
    const jumpBackLabel = `_label${this.nextLabel()}`;
    block.push(new Label(jumpBackLabel))
    this.createExpressionAsm(expressionChompTester, block);
    const responseRegister = this.getExpressionRegister(expressionChompTester);
    const jumpOverLabel = `_label${this.nextLabel()}`;
    block.push(new Test(responseRegister, responseRegister));
    this.registerMem.freeRegister(responseRegister);
    block.push(new Jz(jumpOverLabel));
    block.push(this.compileBlock(codeBlock))
    block.push(new Jmp(jumpBackLabel));
    block.push(new Label(jumpOverLabel))
    return block;
  }

  compileFor(child) {
    let block = new RegisterBlock();
    const children = child.childrenChomps;

    let firstPart = children[0];
    let middlePart = children[1];
    let lastPart = children[2];
    let blockPart = children[3];

    this.registerStack.freeze();
    block.push(new Label(`_startForLoop${this.nextLabel()}`))
    switch(firstPart.type) {
      case Initialization: {
        block.push(this.compileInitialization(firstPart))
        break;
      }
      case Assignation: {
        block.push(this.compileAssignation(firstPart))
        break;
      }

      default: {
        break;
      }
    }
    const jumpBackLabel = `_label${this.nextLabel()}`;
    block.push(new Label(jumpBackLabel))
    this.createExpressionAsm(middlePart, block);
    const responseRegister = this.getExpressionRegister(middlePart);
    const jumpOverLabel = `_label${this.nextLabel()}`;
    block.push(new Test(responseRegister, responseRegister));
    this.registerMem.freeRegister(responseRegister);
    block.push(new Jz(jumpOverLabel));
    block.push(this.compileBlock(blockPart));

    block.push(this.compileAssignation(lastPart))
    block.push(new Jmp(jumpBackLabel));
    block.push(new Label(jumpOverLabel))
    block.push(new Pop(this.registerStack.getFreezeTopDiff()))
    this.registerStack.pop();

    return block;
  }

  compileLoop(child) {
    switch(child.buffer) {
      case 'while': {
        return this.compileWhile(child);
      }
      case 'for': {
        return this.compileFor(child);
      }

      default: {
        break;
      }
    }
    
    return new RegisterBlock();
  }

  popReturnStackPointer(block) {
    const methodPointerDiff = this.registerStack.getFreezeTopDiffFromMethod();
    if(methodPointerDiff) {
      block.push(new Pop(methodPointerDiff));
    }
  }

  compileReturnNonVoidMethod(child) {
    const expression = child.childrenChomps[0];

    let block = new RegisterBlock();
    this.createExpressionAsm(expression, block);
    const expressionRegister = this.getExpressionRegister(expression);

    block.push(new Mov('ret', this.registerStack.getStackOffset('return_address'), MovTypes.STACK_TO_REG));
    block.push(new Mov('rsp', expressionRegister, MovTypes.REG_TO_REG))
    this.popReturnStackPointer(block);
    block.push(new Jmp('ret', JmpTypes.REGISTER));
    this.registerMem.freeRegister(expressionRegister);

    return block;
  }

  compileReturnVoidMethod(child) {
    let block = new RegisterBlock();

    block.push(new Mov('ret', this.registerStack.getStackOffset('return_address'), MovTypes.STACK_TO_REG));
    this.popReturnStackPointer(block);
    block.push(new Jmp('ret', JmpTypes.REGISTER));

    return block;
  }

  compileConditionalBlock(child) {
    let block = new RegisterBlock();
    const children = child.childrenChomps;

    const conditionalExpression = children[0];
    const contitionalBlock = children[1];

    this.createExpressionAsm(conditionalExpression, block);

    const responseRegister = this.getExpressionRegister(conditionalExpression);
    const jumpOverLabel = `_label${this.nextLabel()}`;
    block.push(new Test(responseRegister, responseRegister));
    this.registerMem.freeRegister(responseRegister);
    block.push(new Jz(jumpOverLabel));
    block.push(this.compileBlock(contitionalBlock))
    block.push(new Label(jumpOverLabel));
    
    return block;
  }

  compileExpression(child) {
    let block = new RegisterBlock();

    this.createExpressionAsm(child, block);

    return block;
  }

  compileBlock(chomp, withStackPop = true) {
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
        case ReturnWithExpression: {
          block.push(this.compileReturnNonVoidMethod(child));
          break;
        }
        case ReturnWithoutExpression: {
          block.push(this.compileReturnVoidMethod(child));
          break;
        }
        case ConditionalBlocks: {
          block.push(this.compileConditionalBlock(child));
          break;
        }
        case Expression: {
          block.push(this.compileExpression(child));
          break;
        }
        default: {
          break;
        }
      }
    }
    if(withStackPop) {
      this.popStackValues(block);
    }
    this.registerStack.pop();
    return block;
  }

  isMethodMain(methodName) {
    if(methodName.buffer == 'main') {
      return true;
    }

    return false;
  }

  compileMainMethod(methodName, methodBlock) {
    let block = new RegisterBlock();

    const methodBlockNameLabel = `_${methodName}`;
    block.push(new Label(methodBlockNameLabel));
    block.push(this.compileBlock(methodBlock));

    return block;
  }

  compileMethods(method) {
    const children = method.childrenChomps;
    let block = new RegisterBlock();

    const methodHeader = children[0];
    const methodParams = children[1].childrenChomps;
    const methodBlock = children[2];

    const methodName = methodHeader.childrenChomps[1];

    if(this.isMethodMain(methodName)) {
      return this.compileMainMethod(methodName.buffer, methodBlock);
    }

    const methodBlockNameLabel = `_${methodName}`;
    block.push(new Label(methodBlockNameLabel));
    this.registerStack.freeze();
    for(let i = 0; i < methodParams.length; i++) {
      const paramName = methodParams[i].childrenChomps[1];
      this.registerStack.push(paramName.buffer, 4);
    }
    this.registerStack.push('return_address', 4);
    this.registerStack.freezeMethodPointer();
    block.push(this.compileBlock(methodBlock, false));
    this.registerStack.pop();

    return block;
  }

  compileProgram(program, withOptimizations = true) {
    let children = program.childrenChomps;
    this.buildExpressionTrees(program);
    let block = new RegisterBlock();

    block.push(new Jmp('_main'))
    for(let i = 0, c = children.length; i < c; i++) {
      const child = children[i];

      switch(child.type) {
        case Methods: {
          block.push(this.compileMethods(child));
          break;
        }
        default: {
          break;
        }
      }
    }
    if(withOptimizations) {
      block.optimize();
    }

    return block;
  }
}
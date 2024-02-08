import Constant from "../AST/Constant.js";
import Expression from "../AST/Expression.js";
import { MethodCall } from "../AST/Methods.js";
import Variable from "../AST/Variable.js";
import { Add, Cmp, Div, Jmp, Mov, MovTypes, Mul, Or, Pop, Prp, Push, Sete, Setge, Setle, Setne, Setnz, Sub, Test } from "./Register.js";

let nodeID = 0;

export class ExpressionNode {
  constructor(chomp) {
    this.chomp = chomp;
    this.left = null;
    this.right = null;
    this.nodeID = nodeID++;
  }
}

export class ExpressionTree {
  constructor(expressionChomp) {
    this.expressionChomp = expressionChomp;
    this.root = null;
    this.precedence = [
      ['&&', '||'],
      ['==', '!=', '<=', '>=', '<', '>'],
      ['^', '&', '|', '<<', '>>'],
      ['+', '-'],
      ['*', '/', '%'],
    ];
  }

  toString_t(node) {
    if(!node.left && !node.right) {
      return node.chomp.buffer;
    }
    let left = this.toString_t(node.left);
    let right = this.toString_t(node.right);
    return `(${left + node.chomp.buffer + right})`;
  }

  toString() {
    return this.toString_t(this.root);
  }

  createNode(left, right, sign) {
    let parentNode = new ExpressionNode(sign);
    parentNode.left = left;
    parentNode.right = right;

    return parentNode;
  }

  isNodeVariable(node) {
    return node.chomp.type == Variable;
  }

  isNodeMethodCall(node) {
    return node.chomp.type == MethodCall;
  }

  getExpressionRegister(expression, registerMem) {
    return registerMem.registerFromID(expression.expressionTree.root.nodeID)
  }

  getNodeMethodCallRegisterResponse(node, block, registerStack, registerMem) {
    const children = node.childrenChomps;

    const methodName = children[0];
    const methodParamsExpressions = children[1].childrenChomps;

    registerStack.freeze();
    for(let i = 0, c = methodParamsExpressions.length; i < c; i++) {
      const currentExpression = methodParamsExpressions[i];
      currentExpression.expressionTree.addInstructionToBlock(block, registerMem, registerStack);
      const expressionResultRegister = this.getExpressionRegister(currentExpression, registerMem);
      block.push(new Push(expressionResultRegister));
      registerMem.freeRegister(expressionResultRegister);
      registerStack.push(i, 4);
    }
    block.push(new Prp('ret', 2));
    block.push(new Jmp(methodName.buffer));
    block.push(new Pop(registerStack.getFreezeTopDiff()));
    registerStack.pop();
    return 'rsp';
  }

  getNodeValue(node, block, registerStack, registerMem) {
    const isMethodCall = this.isNodeMethodCall(node);
    if(isMethodCall) {
      return this.getNodeMethodCallRegisterResponse(node.chomp, block, registerStack, registerMem);
    }
    const isVariable = this.isNodeVariable(node);
    if(!isVariable) {
      return node.chomp.buffer;
    }
    return registerStack.getStackOffset(node.chomp.buffer);
  }

  getNodeMovType(node) {
    const isMethodCall = this.isNodeMethodCall(node);
    if(isMethodCall) {
      return MovTypes.REG_TO_REG;
    }
    const isVariable = this.isNodeVariable(node);
    if(isVariable) {
      return MovTypes.STACK_TO_REG;
    }

    return MovTypes.NUMBER_TO_REG;
  }

  findRegisterForNode(node, registerMem) {
    const returnedData = registerMem.isNodeIDUsed(node.nodeID);
    if(returnedData) {
      return returnedData
    }
    const freeRegister = registerMem.findUnusedRegister();
    registerMem.saveRegisterID(freeRegister, node.nodeID);
    return freeRegister;
  }

  isLeaf(node) {
    return !node.left && !node.right;
  }

  add_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);
    
    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Add(freeBufferRegister, freeRegisterSrc, freeRegisterDst));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  sub_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);
    
    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Sub(freeBufferRegister, freeRegisterSrc, freeRegisterDst));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  mul_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Mul(freeBufferRegister, freeRegisterSrc, freeRegisterDst));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  div_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Div(freeRegisterSrc, freeRegisterDst));
    block.push(new Mov(freeBufferRegister, 'HI', MovTypes.REG_TO_REG))

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  reminder_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Div(freeRegisterSrc, freeRegisterDst));
    block.push(new Mov(freeBufferRegister, 'LO', MovTypes.REG_TO_REG))

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  equal_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    block.push(new Sete(freeBufferRegister));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  setGe_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    block.push(new Setge(freeBufferRegister));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  setLe_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    block.push(new Setle(freeBufferRegister));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  notEqual_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    block.push(new Setne(freeBufferRegister));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  less_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    block.push(new Mov(freeBufferRegister, 'CF', MovTypes.REG_TO_REG));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  more_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
    
    let swapingBuffer = this.findRegisterForNode(node, registerMem); // x = 1 - x in order to invert the flag value.
    block.push(new Mov(swapingBuffer, '1', MovTypes.NUMBER_TO_REG));
    block.push(new Sub(freeBufferRegister, swapingBuffer, 'CF'));
    registerMem.freeRegister(swapingBuffer);
  }

  doubleAnd_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Test(freeRegisterSrc, freeRegisterDst));
    block.push(new Setnz(freeBufferRegister));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  doubleOr_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, block, registerStack, registerMem), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, block, registerStack, registerMem), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Or(freeRegisterSrc, freeRegisterDst));
    block.push(new Setnz(freeBufferRegister));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  addInstructionToBlock_t(node, block, registerMem, registerStack) {
    if(!node.left && !node.right) {
      return ;
    }

    this.addInstructionToBlock_t(node.left, block, registerMem, registerStack);
    this.addInstructionToBlock_t(node.right, block, registerMem, registerStack);
    switch(node.chomp.buffer) {
      case '+': {
        this.add_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '-': {
        this.sub_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '*': {
        this.mul_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '==': {
        this.equal_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '<': {
        this.less_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '>': {
        this.more_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '!=': {
        this.notEqual_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '&&': {
        this.doubleAnd_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '||': {
        this.doubleOr_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '>=': {
        this.setGe_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '<=': {
        this.setLe_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '/': {
        this.div_InstructionSet(node, block, registerMem, registerStack);
        break;
      }
      case '%': {
        this.reminder_InstructionSet(node, block, registerMem, registerStack);
        break;
      }

      default: {
        break;
      }
    }
  }

  addInstructionToBlock(block, registerMem, registerStack) {
    if(!this.root.left && !this.root.right) {
      let freeRegisterSrc = this.findRegisterForNode(this.root, registerMem);
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(this.root, block, registerStack, registerMem), this.getNodeMovType(this.root)));
      return ;
    }

    this.addInstructionToBlock_t(this.root, block, registerMem, registerStack);
  }

  expressionRoot(chomp) {
    let expressionNode = new ExpressionTree(chomp);
    expressionNode.build();
    return expressionNode.root;
  }

  build_t(depth = 0, index) {
    let children = this.expressionChomp.childrenChomps;
    if(depth >= this.precedence.length) {
      if(children[index[0]].type == Expression) {
        return this.expressionRoot(children[index[0]]);
      }
      return new ExpressionNode(children[index[0]]);
    }
    let expressionNode = this.build_t(depth + 1, index);
    while(index[0] + 1 < children.length) {
      const currentSign = children[index[0] + 1];
      let hasOperationBeenFound = false;
      for(let i = 0, c = this.precedence[depth].length; i < c; i++) {
        if(this.precedence[depth][i] == currentSign.buffer) {
          index[0] += 2;
          const nextNode = this.build_t(depth + 1, index);
          expressionNode = this.createNode(expressionNode, nextNode, currentSign);
          hasOperationBeenFound = true;
        }
      }
      if(!hasOperationBeenFound) {
        break;
      }
    }
    return expressionNode;
  }

  build() {
    this.root = this.build_t(0, [0]);
  }
}
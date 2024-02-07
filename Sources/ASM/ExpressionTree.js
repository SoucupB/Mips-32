import Constant from "../AST/Constant.js";
import Expression from "../AST/Expression.js";
import Variable from "../AST/Variable.js";
import { Add, Cmp, Mov, MovTypes, Mul, Sub } from "./Register.js";

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

  getNodeValue(node, registerStack) {
    const isVariable = this.isNodeVariable(node);
    if(!isVariable) {
      return node.chomp.buffer;
    }
    return registerStack.getStackOffset(node.chomp.buffer);
  }

  getNodeMovType(node) {
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
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, registerStack), this.getNodeMovType(node.left)));
    }
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, registerStack), this.getNodeMovType(node.right)))
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
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, registerStack), this.getNodeMovType(node.left)));
    }
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, registerStack), this.getNodeMovType(node.right)))
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
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, registerStack), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, registerStack), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Mul(freeBufferRegister, freeRegisterSrc, freeRegisterDst));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  equal_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, registerStack), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, registerStack), this.getNodeMovType(node.right)))
    }

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    block.push(new Mov(freeBufferRegister, 'ZF', MovTypes.REG_TO_REG));

    registerMem.freeRegister(freeRegisterSrc);
    registerMem.freeRegister(freeRegisterDst);
  }

  less_InstructionSet(node, block, registerMem, registerStack) {
    let freeRegisterSrc = this.findRegisterForNode(node.left, registerMem);
    let freeRegisterDst = this.findRegisterForNode(node.right, registerMem);

    if(this.isLeaf(node.left)) {
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, registerStack), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, registerStack), this.getNodeMovType(node.right)))
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
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(node.left, registerStack), this.getNodeMovType(node.left)));
    }
    
    if(this.isLeaf(node.right)) {
      block.push(new Mov(freeRegisterDst, this.getNodeValue(node.right, registerStack), this.getNodeMovType(node.right)))
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

      default: {
        break;
      }
    }
  }

  addInstructionToBlock(block, registerMem, registerStack) {
    if(!this.root.left && !this.root.right) {
      let freeRegisterSrc = this.findRegisterForNode(this.root, registerMem);
      block.push(new Mov(freeRegisterSrc, this.getNodeValue(this.root, registerStack), this.getNodeMovType(this.root)));
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
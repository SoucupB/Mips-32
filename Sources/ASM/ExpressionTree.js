import Constant from "../AST/Constant.js";
import Expression from "../AST/Expression.js";
import { MethodCall } from "../AST/Methods.js";
import { Pointer } from "../AST/Pointer.js";
import Variable from "../AST/Variable.js";
import { Add, Cmp, Div, Jmp, Mov, MovTypes, Mul, Or, Pop, PopTypes, Prp, Push, Setdor, Sete, Setge, Setle, Setne, Setnz, Sub, Test } from "./Register.js";

let nodeID = 0;

export class ExpressionNode {
  constructor(chomp) {
    this.chomp = chomp;
    this.left = null;
    this.right = null;
    this.nodeID = `expr-node-${nodeID++}`;
    this.register = null;
  }
}

export const ExpressionReturnTypes = {
  REGISTER: 1,
  STACK_OFFSET: 2
};

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

    this.returnType = ExpressionReturnTypes.REGISTER;
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
    if(!node || !node.chomp) {
      return false;
    }
    return node.chomp.type == MethodCall;
  }

  getExpressionRegister(expression) {
    return expression.expressionTree.root.register;
  }

  getRegister(registerMem) {
    return this.root.register;
  }

  getNodeMethodCallRegisterResponse(node, block, registerStack, registerMem) {
    const children = node.chomp.childrenChomps;

    const methodName = children[0];
    const methodParamsExpressions = children[1].childrenChomps;
    const dateTime = Date.now();
    registerStack.freeze();
    for(let i = 0, c = methodParamsExpressions.length; i < c; i++) {
      const currentExpression = methodParamsExpressions[i];

      currentExpression.expressionTree.addInstructionToBlockWithOrder(block, registerMem, registerStack);
      const expressionResultRegister = this.getExpressionRegister(currentExpression);
      block.push(new Push(expressionResultRegister));
      registerMem.freeRegister(expressionResultRegister);
      registerStack.push(`${dateTime}_${i}`, 4);
    }
    registerStack.push(`return_address_offset_${dateTime}`, 4);
    block.push(new Prp('ret', 3));
    block.push(new Push('ret'));
    block.push(new Jmp(`_${methodName.buffer}`));
    block.push(new Pop(registerStack.getFreezeTopDiff()));
    registerStack.pop();
    block.push(new Push('rsp'))
    registerStack.push(node.nodeID, 4);
    return 'rsp';
  }

  getNodeValue(node, block, registerStack, registerMem) {
    const isMethodCall = this.isNodeMethodCall(node);
    if(isMethodCall) {
      return this.getNodeMethodCallRegisterResponse(node, block, registerStack, registerMem);
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
    if(returnedData != null) {
      return returnedData
    }
    const freeRegister = registerMem.findUnusedRegister();
    registerMem.saveRegisterID(freeRegister, node.nodeID);
    node.register = freeRegister;
    return freeRegister;
  }

  isLeaf(node) {
    return !node.left && !node.right;
  }

  pushNonPointerNode(node, block, registerMem, registerStack) {
    let register = this.findRegisterForNode(node, registerMem);
    block.push(new Mov(register, this.getNodeValue(node, block, registerStack, registerMem), this.getNodeMovType(node)));
    return register;
  }

  pushPointerNode(node, block, registerMem, registerStack) {
    const pointerExpression = node.chomp.childrenChomps[0];
    pointerExpression.expressionTree.addInstructionToBlockWithOrder(block, registerMem, registerStack);
    let register = this.findRegisterForNode(node, registerMem);

    const regSrc = pointerExpression.expressionTree.getRegister(registerMem);
    block.push(new Mov(register, regSrc, MovTypes.REG_MEM_TO_REG));
    if(register != regSrc) {
      registerMem.freeRegister(regSrc);
    }

    return register;
  }

  pushLeafNode(node, block, registerMem, registerStack) {
    switch(node.chomp.type) {
      case Pointer: {
        return this.pushPointerNode(node, block, registerMem, registerStack)
      }

      default: {
        return this.pushNonPointerNode(node, block, registerMem, registerStack)
      }
    }
  }

  pushMov(node, block, registerMem, registerStack) {
    if(this.isLeaf(node)) {
      return this.pushLeafNode(node, block, registerMem, registerStack);
    }
    let register = this.findRegisterForNode(node, registerMem);
    block.push(new Mov(register, registerStack.getStackOffset(node.nodeID), MovTypes.STACK_TO_REG));
    return register;
  }

  movAndGetFreeRegisters(node, block, registerMem, registerStack) {
    let registers = [null, null];

    let nodes = [node.left, node.right];
    for(let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i];
      if(this.isNodeMethodCall(currentNode)) {
        this.getNodeMethodCallRegisterResponse(currentNode, block, registerStack, registerMem);
        registers[i] = this.findRegisterForNode(currentNode, registerMem);
      }
    }

    for(let i = 0, c = registers.length; i < c; i++) {
      if(registers[i] != null) {
        block.push(new Mov(registers[i], registerStack.getStackOffset(nodes[i].nodeID), MovTypes.STACK_TO_REG));
        continue;
      }
      registers[i] = this.pushMov(nodes[i], block, registerMem, registerStack);
    }

    return registers;
  }

  freeRegisters(registerArray, registerMem) {
    for(let i = 0, c = registerArray.length; i < c; i++) {
      registerMem.freeRegister(registerArray[i]);
    }
  }

  addNodeToTheStack(node, register, block, registerStack, registerMem) {
    block.push(new Push(register))
    registerStack.push(node.nodeID, 4);

    this.freeRegisters([register], registerMem);
  }

  add_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Add(freeBufferRegister, freeRegisterSrc, freeRegisterDst));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
    
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem);
  }

  sub_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Sub(freeBufferRegister, freeRegisterSrc, freeRegisterDst));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);

    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
  }

  mul_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Mul(freeBufferRegister, freeRegisterSrc, freeRegisterDst));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);

    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
  }

  div_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Div(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);

    block.push(new Mov(freeBufferRegister, 'HI', MovTypes.REG_TO_REG))
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  reminder_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Div(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);

    block.push(new Mov(freeBufferRegister, 'LO', MovTypes.REG_TO_REG))
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  equal_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    
    block.push(new Sete(freeBufferRegister));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  setGe_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);

    block.push(new Setge(freeBufferRegister));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  setLe_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);

    block.push(new Setle(freeBufferRegister));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  notEqual_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);

    block.push(new Setne(freeBufferRegister));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  less_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);

    block.push(new Mov(freeBufferRegister, 'CF', MovTypes.REG_TO_REG));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  more_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Cmp(freeRegisterSrc, freeRegisterDst));
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
    let freeBufferRegister = this.findRegisterForNode(node, registerMem);

    block.push(new Mov(freeBufferRegister, 'CT', MovTypes.REG_TO_REG));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  doubleAnd_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    block.push(new Test(freeRegisterSrc, freeRegisterDst));  
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Setnz(freeBufferRegister));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
  }

  doubleOr_InstructionSet(node, block, registerMem, registerStack) {
    let [freeRegisterSrc, freeRegisterDst] = this.movAndGetFreeRegisters(node, block, registerMem, registerStack);

    let freeBufferRegister = this.findRegisterForNode(node, registerMem);
    block.push(new Or(freeRegisterSrc, freeRegisterDst));
    block.push(new Setdor(freeBufferRegister));
    this.addNodeToTheStack(node, freeBufferRegister, block, registerStack, registerMem);
    this.freeRegisters([freeRegisterSrc, freeRegisterDst], registerMem)
  }

  addInstructions(node, block, registerMem, registerStack) {
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

  addInstructionToBlock_t(node, block, registerMem, registerStack) {
    if(!node.left && !node.right) {
      return ;
    }

    this.addInstructionToBlock_t(node.left, block, registerMem, registerStack);
    this.addInstructionToBlock_t(node.right, block, registerMem, registerStack);
    
    this.addInstructions(node, block, registerMem, registerStack);
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

  isOperationLeaf(node) {
    if(this.isLeaf(node)) {
      return false;
    }
    return this.isLeaf(node.left) && this.isLeaf(node.right)
  }

  numberOfOperations(node) {
    if(!node) {
      return 0;
    }
    return this.numberOfOperations(node.left) + this.numberOfOperations(node.right) + 1;
  }

  isVisited(node, visited) {
    return node.nodeID in visited;
  }

  order_t(currentNode, visited, currentOrder) {
    if(this.isVisited(currentNode, visited)) {
      return ;
    }
    if(this.isLeaf(currentNode)) {
      return ;
    }

    if(this.isOperationLeaf(currentNode)) {
      currentOrder.push(currentNode.left);
      currentOrder.push(currentNode.right);
      currentOrder.push(currentNode);
      
      visited[currentNode.left.nodeID] = 1;
      visited[currentNode.right.nodeID] = 1;
      visited[currentNode.nodeID] = 1;
      return ;
    }

    if(this.isVisited(currentNode.left, visited) && this.isVisited(currentNode.right, visited)) {
      visited[currentNode.nodeID] = 1;
      currentOrder.push(currentNode);
      return ;
    }

    if(this.isVisited(currentNode.left, visited) && this.isLeaf(currentNode.right)) {
      visited[currentNode.nodeID] = 1;
      visited[currentNode.right.nodeID] = 1;
      currentOrder.push(currentNode.right);
      currentOrder.push(currentNode);
      return ;
    }

    if(this.isVisited(currentNode.right, visited) && this.isLeaf(currentNode.left)) {
      visited[currentNode.nodeID] = 1;
      visited[currentNode.left.nodeID] = 1;
      currentOrder.push(currentNode.left);
      currentOrder.push(currentNode);
      return ;
    }

    this.order_t(currentNode.left, visited, currentOrder);
    this.order_t(currentNode.right, visited, currentOrder);
  }
  
  order() {
    let visited = {};
    let currentOrder = [];

    let nodesAmount = this.numberOfOperations(this.root);
    const currentNode = this.root;
    if(this.isLeaf(currentNode)) {
      return [currentNode];
    }

    while(currentOrder.length < nodesAmount) {
      this.order_t(currentNode, visited, currentOrder);
    }

    return currentOrder;
  }

  addResultToStack(block, registerMem, registerStack) {
    if(this.returnType == ExpressionReturnTypes.STACK_OFFSET) {
      const currentRegister = this.getRegister(registerMem);
      block.push(new Push(currentRegister));
      registerStack.push(this.root.nodeID, 4);
      this.freeRegisters([currentRegister], registerMem)
    }
  }

  pushLastNode(block, registerMem, registerStack) {
    this.pushMov(this.root, block, registerMem, registerStack);
    let freeRegisterSrc = this.findRegisterForNode(this.root, registerMem);
    block.push(new Push(freeRegisterSrc));
    registerStack.push(this.root.nodeID, 4);
    block.push(new Pop(registerStack.getFreezeTopDiff()));
    registerStack.pop();
    this.addResultToStack(block, registerMem, registerStack);
    this.freeRegisters([freeRegisterSrc], registerMem);
  }

  addInstructionToBlockWithOrder(block, registerMem, registerStack, returnType = ExpressionReturnTypes.REGISTER) {
    registerStack.freeze();

    this.returnType = returnType;

    if(!this.root.left && !this.root.right) {
      this.pushLastNode(block, registerMem, registerStack);
      return ;
    }
    const currentOrder = this.order();
    for(let i = 0, c = currentOrder.length; i < c; i++) {
      this.addInstructions(currentOrder[i], block, registerMem, registerStack);
    }
    block.push(new Pop(registerStack.getFreezeTopDiff()));
    registerStack.pop();
    this.addResultToStack(block, registerMem, registerStack);
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
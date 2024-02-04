import Constant from "../AST/Constant.js";
import Variable from "../AST/Variable.js";

export class ExpressionNode {
  constructor(chomp) {
    this.chomp = chomp;
    this.left = null;
    this.right = null;
  }
}

export class ExpressionTree {
  constructor(expressionChomp) {
    this.expressionChomp = expressionChomp;
    this.root = null;
  }

  static precedenceOperations() {
    return [
      ['*', '/'],
      ['+', '-']
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

  build() {
    let children = this.expressionChomp.childrenChomps;
    let index = 0;
    let expressionNode = new ExpressionNode(children[index]);
    index++;
    while(index < children.length) {
      const currentSign = children[index];
      index++;
      const nextOperand = children[index];
      let nextNode = new ExpressionNode(currentSign);
      nextNode.left = expressionNode;
      nextNode.right = new ExpressionNode(nextOperand);

      expressionNode = nextNode;

      index++;
    }

    this.root = expressionNode;
  }
}
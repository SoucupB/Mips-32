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

  build() {
    let children = this.expressionChomp.childrenChomps;
    let index = 0;
    let expressionNode = new ExpressionNode(children[index]);
    index++;
    while(index < children.left) {
      const currentSign = children[index];
      index++;
      const nextOperand = children[index];
      let nextNode = new ExpressionNode(currentSign);
      nextNode.left = expressionNode;
      nextNode.right = nextOperand;

      expressionNode = nextNode;

      index++;
    }

    this.root = expressionNode;
  }
}
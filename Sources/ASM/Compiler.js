import Expression from "../AST/Expression.js";
import { Helper } from "../AST/Helper.js";
import { ExpressionTree } from "./ExpressionTree.js";

export class Compiler {
  constructor(ast) {
    this.ast = ast;
  }

  buildExpressionTrees() {
    let allExpressions = Helper.searchChompByType(this.ast, {
      type: Expression
    });

    for(let i = 0, c = allExpressions.length; i < c; i++) {
      let expression = new ExpressionTree(allExpressions[i]);
      expression.build();
      allExpressions[i].expressionTree = expression.root;
    }
  }

  compile() {
    this.buildExpressionTrees();
  }
}
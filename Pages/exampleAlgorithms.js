export const exampleAlgorithms = {
  'fibbonachi': `int fibboRecursive(int n) {
  if ( n < 2 ) {
    return 1;
  }
  return fibboRecursive ( n - 1 ) + fibboRecursive ( n - 2 );
}
void main() {
  printNumber(fibboRecursive(8));
}
  `,
  'permutations': `void permutations(int n, int k, int displayBuffer, int checker) {
  if(k >= n) {
    for(int i = 0; i < n; i = i + 1) {
      printNumber(getElement(displayBuffer, i));
      printChar(32);
    }
    printChar(10);
    return ;
  }

  for(int i = 1; i <= n; i = i + 1) {
    if(getElement(checker, i) == 0) {
      setElement(checker, i, 1);
      setElement(displayBuffer, k, i);
      permutations(n, k + 1, displayBuffer, checker);
      setElement(checker, i, 0);
    }
  }
}

void main() {
  int buffer = 1050, n = 3, checker = 2000;
  int responseBuffer = 504;
  permutations(n, 0, responseBuffer, checker);
}
  `,
  'xo_ai': `int getElementInMatrix(int board, int i, int j, int n) {
  return getElement(board, i * n + j);
}

int setElementInMatrix(int board, int i, int j, int n, int element) {
  return setElement(board, i * n + j, element);
}

int getLineResult(int board, int line, int n) {
  int firstElement = getElementInMatrix(board, line, 0, n);
  if(firstElement == getElementInMatrix(board, line, 1, n) && 
      firstElement == getElementInMatrix(board, line, 2, n)) {
    return firstElement;
  }

  return 0;
}

int getColumnResult(int board, int column, int n) {
  int firstElement = getElementInMatrix(board, 0, column, n);
  if(firstElement == getElementInMatrix(board, 1, column, n) && 
      firstElement == getElementInMatrix(board, 2, column, n)) {
    return firstElement;
  }

  return 0;
}

int getLinesResponse(int board, int n) {
  for(int i = 0; i < 3; i = i + 1) {
    int lineResult = getLineResult(board, i, n);
    if(lineResult) {
      return lineResult;
    }
  }

  return 0;
}

int getColumnResponse(int board, int n) {
  for(int i = 0; i < 3; i = i + 1) {
    int columnResult = getColumnResult(board, i, n);
    if(columnResult) {
      return columnResult;
    }
  }

  return 0;
}

int diag(int board, int n) {
  int firstElement = getElementInMatrix(board, 0, 0, n);
  if(firstElement == getElementInMatrix(board, 1, 1, n) &&
      firstElement == getElementInMatrix(board, 2, 2, n)) {
      return firstElement;
  }

  firstElement = getElementInMatrix(board, 0, 2, n);
  if(firstElement == getElementInMatrix(board, 1, 1, n) &&
      firstElement == getElementInMatrix(board, 2, 0, n)) {
    return firstElement;
  }

  return 0;
}

int isDraw(int board) {
  for(int i = 0; i < 3; i = i + 1) {
    for(int j = 0; j < 3; j = j + 1) {
      if(getElementInMatrix(board, i, j, 3) == 0) {
        return 0;
      }
    }
  }

  return 1;
}

int resultMethod(int board, int n) {
  int columnResult = getColumnResponse(board, n);
  if(columnResult) {
    return columnResult;
  }
  int rowResult = getLinesResponse(board, n);
  if(rowResult) {
    return rowResult;
  }
  int diagLines = diag(board, n);
  if(diagLines) {
    return diagLines;
  }
  int drawValues = isDraw(board);
  if(drawValues) {
    return 3;
  }
  return 0;
}

int aiMove(int board, int move, int n, int bestX, int bestY, int depth, int total) {
  int result = resultMethod(board, n);
  if(result == move) {
    return 50;
  }
  if(result == 3 - move) {
    return 0 - 50;
  }
  if(result == 3) {
    return 20;
  }

  int globalMax = 0 - 100;
  for(int i = 0; i < 3; i = i + 1) {
    for(int j = 0; j < 3; j = j + 1) {
      if(getElementInMatrix(board, i, j, n) == 0) {
        setElementInMatrix(board, i, j, 3, move);
        *total = *total + 1;
        int currentMax = 0 - aiMove(board, 3 - move, n, bestX, bestY, depth + 1, total);
        if(currentMax == 20 || currentMax == 0 - 20) {
          currentMax = 20;
        }
        setElementInMatrix(board, i, j, 3, 0);

        if(currentMax > globalMax) {
          globalMax = currentMax;
          if(depth == 0) {
            *bestX = j;
            *bestY = i;
          }
        }
      }
    }
  }

  return globalMax;
}

void main() {
  int board = 3000, bestX = 5000, bestY = 5200, total = 5304;
  setElementInMatrix(board, 0, 0, 3, 1);
  printNumber(aiMove(board, 2, 3, bestX, bestY, 0, total));
  printChar(32);
  printNumber(*bestX);
  printChar(32);
  printNumber(*bestY);
  printChar(32);
  printNumber(*total);
}
  `,
  'hello_world': `void main() {
  printChar(72);printChar(101);
  printChar(108);printChar(108);
  printChar(111);printChar(32);
  printChar(87);printChar(111);
  printChar(114);printChar(108);
  printChar(100);
}
  `,
  'none': `void main() {
  printNumber(10);
}
    `,
  'swap_elements': `void swap(int a, int b) {
  int aux = *a;
  *a = *b;
  *b = aux;
}

void main() {
  int a = 500, b = 504;
  *a = 10;
  *b = 15;
  swap(a, b);
  printNumber(*a);
  printChar(32);
  printNumber(*b);
}
  `
} 
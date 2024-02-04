export const ErrorTypes = {
  NOT_DEFINED: 1,
  MULTIPLE_DEFINITION: 2,
  METHOD_NOT_DEFINED: 3,
  WRONG_NUMBER_OF_PARAMETERS: 4,
};


export class CompilationErrors {
  constructor(string, type) {
    this.string = string;
    this.type = type;
  }

  toString() {
    
  }
}
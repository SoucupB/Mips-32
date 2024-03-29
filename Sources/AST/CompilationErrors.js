export const ErrorTypes = {
  VARIABLE_NOT_DEFINED: 1,
  VARIABLE_MULTIPLE_DEFINITION: 2,
  METHOD_NOT_DEFINED: 3,
  WRONG_NUMBER_OF_PARAMETERS: 4,
  NO_ERRORS: 5,
  INVALID_RETURN: 6,
  METHOD_MULTIPLE_DEFINITION: 7,
  PREDEFINED_VALUE: 8,
  MISSING_MAIN_METHOD: 9,
  MULTIPLE_MAIN_METHODS: 10,
  PARSE_ERROR: 11,
  AMBIGUOS_DECLARATION: 12,
  INVALID_VOID_EXPRESSION_USE: 13
};


export class CompilationErrors {
  constructor(buffer, type) {
    this.buffer = buffer;
    this.type = type;
  }

  static clean() {
    return new CompilationErrors(null, ErrorTypes.NO_ERRORS);
  }

  isClean() {
    return this.type == ErrorTypes.NO_ERRORS;
  }

  toString() {
    for(const [key, value] of Object.entries(ErrorTypes)) {
      if(value == this.type) {
        return key;
      }
    }
    return "";
  }
}
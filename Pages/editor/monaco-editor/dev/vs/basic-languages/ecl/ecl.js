/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.47.0(69991d66135e4a1fc1cf0b1ac4ad25d429866a0d)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
define("vs/basic-languages/ecl/ecl", ["require"],(require)=>{
"use strict";
var moduleExports = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/basic-languages/ecl/ecl.ts
  var ecl_exports = {};
  __export(ecl_exports, {
    conf: () => conf,
    language: () => language
  });
  var conf = {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"]
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"]
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "'", close: "'", notIn: ["string", "comment"] },
      { open: '"', close: '"', notIn: ["string", "comment"] }
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: "<", close: ">" },
      { open: "'", close: "'" },
      { open: '"', close: '"' }
    ]
  };
  var language = {
    defaultToken: "",
    tokenPostfix: ".ecl",
    ignoreCase: true,
    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.square" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
      { open: "<", close: ">", token: "delimiter.angle" }
    ],
    pounds: [
      "append",
      "break",
      "declare",
      "demangle",
      "end",
      "for",
      "getdatatype",
      "if",
      "inmodule",
      "loop",
      "mangle",
      "onwarning",
      "option",
      "set",
      "stored",
      "uniquename"
    ].join("|"),
    keywords: [
      "__compressed__",
      "after",
      "all",
      "and",
      "any",
      "as",
      "atmost",
      "before",
      "beginc",
      "best",
      "between",
      "case",
      "cluster",
      "compressed",
      "compression",
      "const",
      "counter",
      "csv",
      "default",
      "descend",
      "embed",
      "encoding",
      "encrypt",
      "end",
      "endc",
      "endembed",
      "endmacro",
      "enum",
      "escape",
      "except",
      "exclusive",
      "expire",
      "export",
      "extend",
      "fail",
      "few",
      "fileposition",
      "first",
      "flat",
      "forward",
      "from",
      "full",
      "function",
      "functionmacro",
      "group",
      "grouped",
      "heading",
      "hole",
      "ifblock",
      "import",
      "in",
      "inner",
      "interface",
      "internal",
      "joined",
      "keep",
      "keyed",
      "last",
      "left",
      "limit",
      "linkcounted",
      "literal",
      "little_endian",
      "load",
      "local",
      "locale",
      "lookup",
      "lzw",
      "macro",
      "many",
      "maxcount",
      "maxlength",
      "min skew",
      "module",
      "mofn",
      "multiple",
      "named",
      "namespace",
      "nocase",
      "noroot",
      "noscan",
      "nosort",
      "not",
      "noxpath",
      "of",
      "onfail",
      "only",
      "opt",
      "or",
      "outer",
      "overwrite",
      "packed",
      "partition",
      "penalty",
      "physicallength",
      "pipe",
      "prefetch",
      "quote",
      "record",
      "repeat",
      "retry",
      "return",
      "right",
      "right1",
      "right2",
      "rows",
      "rowset",
      "scan",
      "scope",
      "self",
      "separator",
      "service",
      "shared",
      "skew",
      "skip",
      "smart",
      "soapaction",
      "sql",
      "stable",
      "store",
      "terminator",
      "thor",
      "threshold",
      "timelimit",
      "timeout",
      "token",
      "transform",
      "trim",
      "type",
      "unicodeorder",
      "unordered",
      "unsorted",
      "unstable",
      "update",
      "use",
      "validate",
      "virtual",
      "whole",
      "width",
      "wild",
      "within",
      "wnotrim",
      "xml",
      "xpath"
    ],
    functions: [
      "abs",
      "acos",
      "aggregate",
      "allnodes",
      "apply",
      "ascii",
      "asin",
      "assert",
      "asstring",
      "atan",
      "atan2",
      "ave",
      "build",
      "buildindex",
      "case",
      "catch",
      "choose",
      "choosen",
      "choosesets",
      "clustersize",
      "combine",
      "correlation",
      "cos",
      "cosh",
      "count",
      "covariance",
      "cron",
      "dataset",
      "dedup",
      "define",
      "denormalize",
      "dictionary",
      "distribute",
      "distributed",
      "distribution",
      "ebcdic",
      "enth",
      "error",
      "evaluate",
      "event",
      "eventextra",
      "eventname",
      "exists",
      "exp",
      "fail",
      "failcode",
      "failmessage",
      "fetch",
      "fromunicode",
      "fromxml",
      "getenv",
      "getisvalid",
      "global",
      "graph",
      "group",
      "hash",
      "hash32",
      "hash64",
      "hashcrc",
      "hashmd5",
      "having",
      "httpcall",
      "httpheader",
      "if",
      "iff",
      "index",
      "intformat",
      "isvalid",
      "iterate",
      "join",
      "keydiff",
      "keypatch",
      "keyunicode",
      "length",
      "library",
      "limit",
      "ln",
      "loadxml",
      "local",
      "log",
      "loop",
      "map",
      "matched",
      "matchlength",
      "matchposition",
      "matchtext",
      "matchunicode",
      "max",
      "merge",
      "mergejoin",
      "min",
      "nofold",
      "nolocal",
      "nonempty",
      "normalize",
      "nothor",
      "notify",
      "output",
      "parallel",
      "parse",
      "pipe",
      "power",
      "preload",
      "process",
      "project",
      "pull",
      "random",
      "range",
      "rank",
      "ranked",
      "realformat",
      "recordof",
      "regexfind",
      "regexreplace",
      "regroup",
      "rejected",
      "rollup",
      "round",
      "roundup",
      "row",
      "rowdiff",
      "sample",
      "sequential",
      "set",
      "sin",
      "sinh",
      "sizeof",
      "soapcall",
      "sort",
      "sorted",
      "sqrt",
      "stepped",
      "stored",
      "sum",
      "table",
      "tan",
      "tanh",
      "thisnode",
      "topn",
      "tounicode",
      "toxml",
      "transfer",
      "transform",
      "trim",
      "truncate",
      "typeof",
      "ungroup",
      "unicodeorder",
      "variance",
      "wait",
      "which",
      "workunit",
      "xmldecode",
      "xmlencode",
      "xmltext",
      "xmlunicode"
    ],
    typesint: ["integer", "unsigned"].join("|"),
    typesnum: ["data", "qstring", "string", "unicode", "utf8", "varstring", "varunicode"],
    typesone: [
      "ascii",
      "big_endian",
      "boolean",
      "data",
      "decimal",
      "ebcdic",
      "grouped",
      "integer",
      "linkcounted",
      "pattern",
      "qstring",
      "real",
      "record",
      "rule",
      "set of",
      "streamed",
      "string",
      "token",
      "udecimal",
      "unicode",
      "unsigned",
      "utf8",
      "varstring",
      "varunicode"
    ].join("|"),
    operators: ["+", "-", "/", ":=", "<", "<>", "=", ">", "\\", "and", "in", "not", "or"],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    // escape sequences
    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    // The main tokenizer for our languages
    tokenizer: {
      root: [
        [/@typesint[4|8]/, "type"],
        [/#(@pounds)/, "type"],
        [/@typesone/, "type"],
        [
          /[a-zA-Z_$][\w-$]*/,
          {
            cases: {
              "@functions": "keyword.function",
              "@keywords": "keyword",
              "@operators": "operator"
            }
          }
        ],
        // whitespace
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"],
        [/[<>](?!@symbols)/, "@brackets"],
        [
          /@symbols/,
          {
            cases: {
              "@operators": "delimiter",
              "@default": ""
            }
          }
        ],
        // numbers
        [/[0-9_]*\.[0-9_]+([eE][\-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F_]+/, "number.hex"],
        [/0[bB][01]+/, "number.hex"],
        // binary: use same theme style as hex
        [/[0-9_]+/, "number"],
        // delimiter: after number because of .\d floats
        [/[;,.]/, "delimiter"],
        // strings
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string"],
        // characters
        [/'[^\\']'/, "string"],
        [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
        [/'/, "string.invalid"]
      ],
      whitespace: [
        [/[ \t\v\f\r\n]+/, ""],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"]
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"]
      ],
      string: [
        [/[^\\']+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/'/, "string", "@pop"]
      ]
    }
  };
  return __toCommonJS(ecl_exports);
})();
return moduleExports;
});

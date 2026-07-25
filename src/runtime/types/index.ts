//
// CONDITION ENGINE (LISP-style, serialisable)
//

import type { FieldMap, Select, Text } from "./form";

export type FieldRef = number | string;

type CompareOp =
  | "eq"
  | "notEq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "includes"
  | "startsWith"
  | "endsWith"
  | "matches";

type UnaryOp = "empty" | "notEmpty" | "true" | "false";
type LogicalOp = "and" | "or";

type Leaf = [CompareOp, FieldRef, unknown];
type UnaryLeaf = [UnaryOp, FieldRef];
type NotNode = ["not", Expr];
type LogicNode = [LogicalOp, ...Expr[]];

export type Expr = Leaf | UnaryLeaf | NotNode | LogicNode;
export type Condition = Expr;

//
// Schema
//
export type ApiSource = {
  guard?: Condition;
  fetch: string;
  method?: "GET";
  query?: Record<string, any>;
  map?: { label: string; value: string };
  default?: string;
};

export type HandlerSource = {
  guard?: Condition;
  handler: string;
  args?: Record<string, any>;
  default?: string;
};

type SchemaFieldMap = {
  text: Omit<FieldMap["text"], "value"> & {
    id?: string;
    visible?: Condition;
    required?: Text["required"] | Condition;
    value?: string | ApiSource | HandlerSource;
  };

  select: Omit<FieldMap["select"], "value" | "options"> & {
    id?: string;
    visible?: Condition;
    required?: Select["required"] | Condition;
    options?: Select["options"] | ApiSource | HandlerSource;
    value?: string | ApiSource | HandlerSource;
  };
};

export type SchemaField = {
  [K in keyof SchemaFieldMap]: {
    as: K;
  } & SchemaFieldMap[K];
}[keyof SchemaFieldMap];

export type Node = {
  id: string;
  self: string;
  prop: string;
  deps: string[];
  args?: any;
  meta: {
    as: keyof SchemaFieldMap;
    type: string;
  };
};

// ─────────────────────────────────────────────
// Exploring
// ─────────────────────────────────────────────

// Developer
//     ↓
// Schema
//     ↓
// Compiler
//     ↓
// Graph (nodes + dependencies)
//     ↓
// Validation (cycles, missing refs, invalid handlers)
//     ↓
// Execution Plan
//     ↓
// Runtime Engine
//     ↓
// FieldState
//     ↓
// UI Fields

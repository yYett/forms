import type { Expr, FieldRef } from "../types";

function isEmpty(value: unknown): boolean {
  return value == null || value === "";
}

function asString(value: unknown): string {
  return String(value ?? "");
}

function asNumber(value: unknown): number {
  return Number(value);
}

function resolveRef(ref: FieldRef, values: Record<FieldRef, unknown>): unknown {
  const key = typeof ref === "string" ? ref.replace(/^\$/, "") : ref;
  return values[key];
}

export function evaluateExpr(
  expr: Expr,
  values: Record<FieldRef, unknown>,
): boolean {
  const [op, ...args] = expr;

  const ref = args[0] as FieldRef;
  const val = () => resolveRef(ref, values);

  switch (op) {
    // --- Logical ---
    case "and":
      return (args as Expr[]).every((a) => evaluateExpr(a, values));
    case "or":
      return (args as Expr[]).some((a) => evaluateExpr(a, values));
    case "not":
      return !evaluateExpr(args[0] as Expr, values);

    // --- Unary ---
    case "empty":
      return isEmpty(val());
    case "notEmpty":
      return !isEmpty(val());
    case "true":
      return val() === true;
    case "false":
      return val() === false;

    // --- Equality ---
    case "eq":
      return val() === args[1];
    case "notEq":
      return val() !== args[1];

    // --- Numeric ---
    case "gt":
      return asNumber(val()) > asNumber(args[1]);
    case "gte":
      return asNumber(val()) >= asNumber(args[1]);
    case "lt":
      return asNumber(val()) < asNumber(args[1]);
    case "lte":
      return asNumber(val()) <= asNumber(args[1]);

    // --- Array / String ---
    case "includes": {
      const v = val();
      if (Array.isArray(v)) return v.includes(args[1]);
      return asString(v).includes(asString(args[1]));
    }

    // --- String ---
    case "startsWith":
      return asString(val()).startsWith(asString(args[1]));
    case "endsWith":
      return asString(val()).endsWith(asString(args[1]));
    case "matches":
      return new RegExp(asString(args[1])).test(asString(val()));

    default:
      throw new Error(`Unknown operator: ${op}`);
  }
}

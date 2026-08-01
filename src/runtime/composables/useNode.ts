export function useNode(fields: any[]) {
  const nodes = new Map<string, any>();

  for (const field of fields) {
    for (const prop of field.$nodes) {
      const key = `${field.id}.${prop}`;
      const value = field[prop];

      nodes.set(key, {
        self: field.id,
        prop,
        args: value.args,
        default: value.default,
        deps: value.deps,
        guard: value.guard,
        strategy: value.strategy,
      });
    }
  }

  return { nodes };
}

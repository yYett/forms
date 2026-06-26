export function useData(data: any) {
  const fields: any[] = [];

  const defaultValues: any = {
    options: [],
    value: "",
  };

  for (let i = 0; i < data.fields.length; i++) {
    const field: any = data.fields[i];

    for (const prop in field) {
      const propValue = field[prop];
      field.$nodes = [];
      field.id = `${field.name}${i}`;

      if (["required", "disabled", "visible", "readonly"].includes(prop)) {
        if (typeof propValue === "boolean") {
          // field[prop] = { strategy: "static", default: propValue };
          continue;
        }

        if (Array.isArray(propValue)) {
          field[prop] = {
            strategy: "expr",
            args: propValue,
            deps: extractDeps(propValue),
            default: false,
          };
          field.$nodes.push(prop);
        }
      }

      if (["options", "value"].includes(prop)) {
        if (propValue?.action) {
          field[prop] = {
            strategy: propValue.action,
            guard: propValue?.guard || false,
            args: propValue?.args,
            deps: extractDeps(propValue),
            default: propValue?.default || defaultValues[prop],
          };
          field.$nodes.push(prop);
          continue;
        }

        // field[prop] = { strategy: "static", default: propValue };
      }
    }

    fields.push(field);
  }

  console.log("fields", fields);

  return { fields };
}

function extractDeps(input: unknown): string[] {
  if (!input) return [];

  const deps = new Set<string>();

  function walk(value: unknown) {
    if (typeof value === "string") {
      const matches = value.match(/\$[\w.]+/g) ?? [];

      for (const match of matches) {
        deps.add(match.slice(1));
      }

      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (typeof value === "object" && value) {
      Object.values(value).forEach(walk);
    }
  }

  walk(input);

  return [...deps];
}

export function useData(data: any) {
  const fields: any[] = [];

  const defaultValues: any = {
    options: [],
    value: "",
  };

  for (let i = 0; i < data.fields.length; i++) {
    const field: any = data.fields[i];
    field.id = `${field.name}${i}`;
    field.$nodes = [];

    for (const prop in field) {
      const propValue = field[prop];

      if (["required", "disabled", "visible", "readonly"].includes(prop)) {
        if (typeof propValue === "boolean") continue;

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
      }
    }

    field.validationRules = extractValidationRules(field);
    fields.push(field);
  }

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

function extractValidationRules(field: any): any[] {
  const args: any[] = [];

  args.push(["required", field.required]);

  if (field.type != null && ["email", "url", "password"].includes(field.type)) {
    args.push([field.type]);
  }

  if (field.pattern != null) {
    args.push(["pattern", { regex: field.pattern }]);
  }

  if (field.minlength != null || field.maxlength != null) {
    const { minlength: min, maxlength: max } = field;

    args.push([
      "length",
      { ...(min != null && { min }), ...(max != null && { max }) },
    ]);
  }

  if (field.min != null || field.max != null) {
    const { min, max } = field;
    args.push([
      "range",
      { ...(min != null && { min }), ...(max != null && { max }) },
    ]);
  }

  args.push(...(field.validationRules ?? []));

  return args;
}

// show field group if palte is invalid or not found

// Static — no auth. But tokens are runtime concerns: they live in a cookie, a store, or a composable. They can't be in the field schema.
// The right place — a request interceptor
// Same pattern Nuxt's $fetch already supports via ofetch:

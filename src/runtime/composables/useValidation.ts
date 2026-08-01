import type { Ref } from "vue";

type Validator = {
  name: string;
  normalize?: (value: any) => any;
  validate?: (ctx: any) => string | null;
};

export function useValidation(
  fields: any[],
  runtime: Ref<Record<string, any>>,
  language: string,
) {
  const registry = injectRegistry();
  const compiled = compileValidation(fields);
  const validationDeps = getValidationDeps(fields);
  const errorMessages = injectErrorMessages(language);

  const buildCtx = (id: string, value: any, field: any, params: any) => {
    return {
      value,
      params,
      field,
      formValues: runtime.value,
    };
  };

  const resolveMessage = (
    key: string | null,
    params: Record<string, any>,
  ): string | null => {
    if (!key) return null;

    const arg = errorMessages?.[key] || errorMessages.required;
    return typeof arg === "function" ? arg(params) : arg;
  };

  const validateSync = (id: string, value: any, field: any): string | null => {
    const entries = compiled.get(id);
    if (!entries) return null;

    for (const entry of entries) {
      const validation = registry.get(entry.name);
      if (!validation?.validate) {
        console.warn(`Missing validation "${entry.name}"`);
        continue;
      }

      const normalized = validation.normalize
        ? validation.normalize(value)
        : value;

      const key = validation.validate(
        buildCtx(id, normalized, field, entry.params),
      );

      if (key) return resolveMessage(key, entry.params);
    }

    return null;
  };

  const validate = (id: string, value: any, field: any): string | null => {
    const error = validateSync(id, value, field);
    // if (!error) scheduleAsync(id, value, field);
    return error;
  };

  const validateAll = (
    fields: any[],
    callback: (arg: string | null) => void,
  ): boolean => {
    let isValid = true;

    for (const field of fields) {
      const error = validateSync(
        field.id,
        runtime.value[field.name]?.value,
        field,
      );
      callback(error);
      if (error) isValid = false;
    }

    return isValid;
  };

  const revalidateDeps = (
    ref: string,
    fieldsById: Map<string, any>,
    callback: (id: string, arg: string | null) => void,
  ) => {
    const deps = validationDeps.get(ref);
    if (!deps?.length) return;

    for (const depID of deps) {
      // if !state[depId]?.touched
      const depField = fieldsById.get(depID)!;
      const error = validateSync(depID, runtime.value?.[depField.id], depField);
      callback(depID, error);
    }
  };

  return { validate, validateAll, revalidateDeps };
}

function injectRegistry() {
  const registry = new Map();

  const builtins: Validator[] = [
    {
      name: "required",
      validate({ value }) {
        if (Array.isArray(value)) return value.length ? null : "required";
        if (typeof value === "number")
          return isFinite(value) ? null : "required";
        return value !== "" && value != null ? null : "required";
      },
    },
    {
      name: "email",
      normalize: (v) => v?.trim(),
      validate({ value }) {
        if (!value) return null;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? null
          : "email.invalid";
      },
    },
    {
      name: "length",
      normalize: (v) => (typeof v === "string" ? v.trim() : v),
      validate({ value, params: { min, max } }) {
        if (!value) return null;
        const len = String(value).length;
        if (min != null && min === max && (min > len || len > max))
          return "length.exact";
        if (min != null && len < min) return "length.min";
        if (max != null && len > max) return "length.max";
        return null;
      },
    },
    {
      name: "range",
      validate({ value, params: { min, max } }) {
        if (value === "" || value == null) return null;
        const num = Number(value);
        if (isNaN(num)) return "range.nan";
        if (min != null && num < min) return "range.min";
        if (max != null && num > max) return "range.max";
        return null;
      },
    },
  ];

  for (const entry of builtins) {
    registry.set(entry.name, entry);
  }

  return registry;
}

function compileValidation(fields: any[]) {
  const compiled = new Map<string, any[]>();

  for (const field of fields) {
    if (!field.validationRules?.length) continue;

    compiled.set(
      field.id,
      field.validationRules.map(([name, params]: any) => {
        return { name, params };
      }),
    );
  }

  return compiled;
}

function getValidationDeps(fields: any[]) {
  const validationDeps = new Map<string, string[]>();

  for (const field of fields) {
    if (!field.validationRules?.length) continue;

    for (const [, params] of field.validationRules) {
      if (!params) continue;

      for (const value of Object.values(params as Record<string, any>)) {
        if (typeof value === "string" && value.startsWith("$")) {
          const ref = value.slice(1);
          const list = validationDeps.get(ref) ?? [];
          list.push(field.id);
          validationDeps.set(ref, list);
        }
      }
    }
  }

  return validationDeps;
}

function injectErrorMessages(language: string) {
  const registry: Record<
    string,
    Record<string, string | ((p: Record<string, any>) => string)>
  > = {
    en: {
      required: "This field is required",
      "email.invalid": "Enter a valid email address",
      "date.invalid": "Enter a valid date",

      "length.min": ({ min }) => `Minimum ${min} characters`,
      "length.max": ({ max }) => `Maximum ${max} characters`,
      "length.exact": ({ min }) => `Must be exactly ${min} characters`,

      "range.min": ({ min }) => `Must be at least ${min}`,
      "range.max": ({ max }) => `Must be at most ${max}`,
      "range.nan": "Must be a number",
    },
  };

  return registry?.[language] || registry.en;
}

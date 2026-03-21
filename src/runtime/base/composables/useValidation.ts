import { ref } from "vue";
import type {
  ErrorConstraints,
  ErrorMessages,
  FieldValidations,
  ValidationsKeys,
} from "../types";
import { getMessages } from "../utils/error-messages";

//#region validator
const validator: Record<ValidationsKeys, (...args: any[]) => ErrorConstraints> =
  {
    required: (value: string | boolean | Array<string>): ErrorConstraints => {
      if (Array.isArray(value)) {
        return value.length ? null : ["formsEmptyField"];
      }

      return !!value ? null : ["formsEmptyField"];
    },

    length: (
      value: string,
      args?: { minLength?: number; maxLength?: number },
    ): ErrorConstraints => {
      return validateLength(value, args || {});
    },

    email: (value: string): ErrorConstraints => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value) ? null : ["formsInvalidEmail"];
    },

    url: (value: string): ErrorConstraints => {
      return validateUrl(value);
    },

    pattern: (value: string): ErrorConstraints => {
      return null;
    },
  };

//#endregion

//#region useValidation

export function useValidation(errorMessages?: ErrorMessages) {
  const lang = useState<string>("language");
  const messages = errorMessages ?? getMessages(lang.value);

  const state = ref({
    invalid: false,
    status: "unset",
    errorMessage: "",
  });

  const canValidate = (type: string): boolean => {
    return type in validator;
  };

  const validate = (
    raw: string | boolean | string[],
    validations: FieldValidations[],
  ): void => {
    const value = typeof raw === "string" ? raw.trim() : raw;

    for (const [key, args] of validations) {
      // skip optional validations for empty fields
      if (!value && key !== "required") continue;

      const fn = validator?.[key];
      if (!fn) continue;

      const result = fn(value, args);

      if (result) {
        state.value = {
          invalid: true,
          status: "error",
          errorMessage: getErrorMessage(messages, result),
        };
        return;
      }
    }

    // All validations passed
    state.value = {
      invalid: false,
      status: "valid",
      errorMessage: "",
    };
  };

  return {
    state,
    canValidate,
    validate,
  };
}

//#endregion

//#region Methods

function getErrorMessage(
  messages: ErrorMessages,
  error: ErrorConstraints,
): string {
  if (!error) return "";

  const [key, constraints] = error;

  try {
    const text = messages?.[key] || messages.formsGeneralError;
    // Replace placeholders like{#minLength} with actual values
    return text.replace(/\{#(\w+)\}/g, (_: string, placeholder: string) => {
      if (!placeholder) {
        throw new Error("Invalid placeholder"); // Avoid rendering wrong message
      }

      return String(constraints?.[placeholder] ?? `#{${placeholder}}`);
    });
  } catch {
    return messages?.formsGeneralError ?? "Error";
  }
}

function validateLength(
  value: string,
  { minLength, maxLength }: { minLength?: number; maxLength?: number },
): ErrorConstraints {
  if (minLength == null && maxLength == null) return null;

  const len = value.length;

  // Check for exact length requirement
  if (minLength != null && minLength === maxLength && len !== minLength) {
    return ["formsExactLength", { length: minLength }];
  }

  // Check minimum length
  if (minLength != null && len < minLength) {
    return ["formsMinLength", { minLength }];
  }

  // Check maximum length
  if (maxLength != null && len > maxLength) {
    return ["formsMaxLength", { maxLength }];
  }

  return null;
}

function validateUrl(value: string): ErrorConstraints {
  try {
    const { protocol } = new URL(value);
    return ["https:", "http:"].includes(protocol)
      ? null
      : ["formsGeneralError"];
  } catch {
    return ["formsGeneralError"];
  }
}

//#endregion

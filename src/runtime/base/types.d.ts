type TextTypes = "text" | "password" | "email" | "search" | "tel" | "url";

export type Input = {
  label: string;
  placeholder?: string;
  type?: TextTypes;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  minLength?: number;
  maxLength?: number;
  // pattern: string
};

export type ValidationsDef<K extends string, O = void> = O extends void
  ? [K]
  : [K, O];

export type ValidationsKeys =
  | "required"
  | "length"
  | "email"
  | "url"
  | "pattern";

export type ValidatableTextTypes = Extract<ValidationsKeys, TextTypes>;

export type FieldValidations =
  | ValidationsDef<"required">
  | ValidationsDef<"length", { minLength?: number; maxLength?: number }>
  | ValidationsDef<ValidatableTextTypes>;

export type ErrorMessages = Record<
  | "formsGeneralError"
  | "formsEmptyField"
  | "formsMinLength"
  | "formsMaxLength"
  | "formsMinAndMaxLength"
  | "formsExactLength"
  | "formsMinDate"
  | "formsMaxDate"
  | "formsMinAndMaxDate"
  | "formsInvalidDate"
  | "formsMinSelections"
  | "formsMaxSelections"
  | "formsMinAndMaxSelections"
  | "formsExactSelections"
  | "formsInvalidEmail"
  | "formsInvalidPhoneNumber"
  | "formsInvalidPostalCode",
  string
>;

export type ErrorConstraints =
  | [keyof ErrorMessages, Record<string, number | string>]
  | [keyof ErrorMessages]
  | null;

export type FieldExpose = {
  validate: () => boolean;
};

type BaseField = {
  label: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
};

type TextProps = {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};

type WithMinMaxStep = {
  min?: number | string;
  max?: number | string;
  step?: number;
};

// =========================
// Input map (single source of truth)
// =========================

export type InputMap = {
  // ---- text inputs ----
  text: TextProps;
  password: TextProps;
  email: TextProps;
  tel: TextProps;
  search: TextProps;
  url: Exclude<TextProps, "placeholder" | "pattern">;

  // ---- date inputs ----
  date: WithMinMaxStep;
  "datetime-local": WithMinMaxStep;
  month: WithMinMaxStep;
  week: WithMinMaxStep;
  time: WithMinMaxStep;

  // ---- numeric inputs ----
  number: WithMinMaxStep;
  range: WithMinMaxStep;
};

// =========================
// Final Input type (discriminated union)
// =========================

export type Text = {
  [K in keyof InputMap]: BaseField & {
    type: K;
  } & InputMap[K];
}[keyof InputMap];

export type Checkbox = BaseField;

export type Radio = BaseField;

export type Option = {
  label: string;
  value: string | number;
};

export type Select = {
  options: Option[];
} & BaseField;

export type FieldMap = {
  text: Text;
  select: Select;
};

export type Field = {
  [K in keyof FieldMap]: { as: K } & FieldMap[K];
}[keyof FieldMap];

export type ControlArgs = {
  modelValue: any;
  "onUpdate:modelValue": (val: any) => void;
  [key: string]: any;
};

export {};

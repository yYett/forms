import type { VNode } from "vue";
import type { ControlArgs } from "../types/form";
import { h } from "vue";

function onInputValue(onUpdate: any) {
  return (e: Event) => onUpdate?.((e.target as HTMLInputElement).value);
}

function onChangeChecked(onUpdate: any) {
  return (e: Event) => {
    const el = e.target as HTMLInputElement;
    onUpdate?.(el.checked ? el.value : "");
  };
}

export const fieldControls = {
  text: ({
    modelValue,
    "onUpdate:modelValue": onUpdate,
    ...attrs
  }: ControlArgs): VNode =>
    h("input", {
      ...attrs,
      value: modelValue || "",
      onInput: onInputValue(onUpdate),
    }),

  radio: ({
    modelValue,
    "onUpdate:modelValue": onUpdate,
    ...rest
  }: ControlArgs) =>
    h("input", {
      ...rest,
      type: "radio",
      autocomplete: "off",
      checked: modelValue === rest.value,
      onChange: onInputValue(onUpdate),
    }),

  checkbox: ({
    modelValue,
    "onUpdate:modelValue": onUpdate,
    ...rest
  }: ControlArgs) =>
    h("input", {
      ...rest,
      type: "checkbox",
      checked: modelValue,
      onChange: onChangeChecked(onUpdate),
    }),

  select: ({
    modelValue,
    "onUpdate:modelValue": onUpdate,
    options,
    ...attrs
  }: ControlArgs) =>
    h(
      "select",
      {
        ...attrs,
        value: modelValue ?? "",
        onChange: onInputValue(onUpdate),
      },
      options?.map(
        ({ label, value }: { label: string; value: string }) =>
          label && value && h("option", { value }, label),
      ),
    ),

  // combobox: (args: any) => h(MyCombobox, args),
  // checkboxGroup: (args: any) => h(MyCheckboxGroup, args),
};

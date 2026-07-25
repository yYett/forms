import type { VNode } from "vue";
import type { ControlArgs } from "../types/form";
import { h, resolveComponent } from "vue";

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
    style: _style,
    $nodes: _$nodes,
    visible: _visible,
    ...attrs
  }: ControlArgs): VNode => {
    return h("input", {
      ...attrs,
      value: modelValue || "",
      onInput: onInputValue(onUpdate),
    });
  },

  radio: ({
    modelValue,
    "onUpdate:modelValue": onUpdate,
    style: _style,
    $nodes: _$nodes,
    visible: _visible,
    ...rest
  }: ControlArgs) => {
    return h("input", {
      ...rest,
      type: "radio",
      autocomplete: "off",
      checked: modelValue === rest.value,
      onChange: onInputValue(onUpdate),
    });
  },

  checkbox: ({
    modelValue,
    "onUpdate:modelValue": onUpdate,
    style: _style,
    $nodes: _$nodes,
    visible: _visible,
    ...rest
  }: ControlArgs) => {
    return h("input", {
      ...rest,
      type: "checkbox",
      checked: modelValue,
      onChange: onChangeChecked(onUpdate),
    });
  },

  select: ({
    modelValue,
    "onUpdate:modelValue": onUpdate,
    options,
    style: _style,
    $nodes: _$nodes,
    visible: _visible,
    ...attrs
  }: ControlArgs) => {
    return h(
      "select",
      {
        ...attrs,
        value: modelValue ?? "",
        onChange: onInputValue(onUpdate),
        autocomplete: "off",
      },
      options?.map(({ label, value }: { label: string; value: string }) =>
        h("option", { value }, label),
      ),
    );
  },

  // combobox: (args: any) => h(MyCombobox, args),
  // checkboxGroup: (args: any) => h(MyCheckboxGroup, args),

  // default: ({
  //   modelValue,
  //   "onUpdate:modelValue": onUpdate,
  //   style: _style,
  //   $nodes: _$nodes,
  //   visible: _visible,
  //   ...attrs
  // }) => {
  //   const component = resolveComponent(attrs.as);
  //   return h(component, attrs);
  // },
};

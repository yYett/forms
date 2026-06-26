import type { PropType, VNode } from "vue";
import { defineComponent, h, useId, watchEffect } from "vue";
import { fieldControls } from "../utils/controls";

export default defineComponent({
  name: "Field",

  inheritAttrs: false,

  props: {
    modelValue: [String, Number, Boolean],
    label: { type: String, required: true },
    width: { type: Number, required: false },
    errorMessage: { type: String, required: false },
    as: {
      type: String as PropType<keyof typeof fieldControls>,
      required: false,
      default: () => "text",
    },
  },

  emits: ["update:modelValue"],

  setup(props, { slots, attrs, emit, expose }) {
    const id = useId();

    watchEffect(() => {
      console.log("Field Changed", props.label, props);
    });

    return (): VNode =>
      h(
        "div",
        { class: `form-field w--${props.width || 12}` },
        [
          props.label &&
            h("label", { for: id, class: "field-label" }, props.label),

          slots?.start?.(),

          fieldControls?.[props.as]?.({
            id,
            modelValue: props.modelValue,
            "onUpdate:modelValue": (val: string) =>
              emit("update:modelValue", val),
            ...attrs,
          }),

          slots.end?.(),

          slots.meta?.(),

          props.errorMessage &&
            h("p", { class: "field__error" }, props.errorMessage),
        ].filter(Boolean),
      );
  },
});

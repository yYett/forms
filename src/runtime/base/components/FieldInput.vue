<template>
  <div :class="['field-input', state.status]">
    <input
      :id
      v-model="field"
      :type
      :name="props.name"
      :disabled
      :required
      :readonly
      :placeholder
      :minlength="minLength"
      :maxlength="maxLength"
      :aria-describedby="state.invalid ? `error-${id}` : undefined"
      :aria-invalid="state.invalid"
      @blur="validate(field, validations)"
    />
    <label :for="id">{{ label }}</label>

    <p v-if="maxLength" class="field__counter">
      {{ field.length }}/{{ maxLength }}
    </p>

    <p
      v-show="state.errorMessage"
      :id="`error-${id}`"
      class="field__error"
      aria-live="assertive"
    >
      {{ state.errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useValidation } from "../composables/useValidation";
import type { FieldExpose, FieldValidations, Input } from "../types";

const props = withDefaults(defineProps<Input>(), {
  disabled: false,
  required: false,
  readonly: false,
});

const id = "1";
const field = defineModel<string>({ default: "" });
const { state, canValidate, validate } = useValidation();

const validations = computed(() => {
  const { required, minLength, maxLength, type } = props;
  const args: FieldValidations[] = [];

  if (required) args.push(["required"]);
  if (minLength || maxLength) args.push(["length", { minLength, maxLength }]);
  if (type && canValidate(type)) args.push([type] as FieldValidations);

  return args;
});

defineExpose<FieldExpose>({
  validate: () => {
    validate(field.value, validations.value);
    return !state.value.invalid;
  },
});
</script>

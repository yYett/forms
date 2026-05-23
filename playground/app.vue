<script setup lang="ts">
import Form from "../dist/runtime/components/Form.vue";
import type { Field } from "../src/runtime/types/form";

// const name = ref<string>();
// const phone = ref<string>("");

const { data: form } = await useFetch<any[]>("/api/fields", {
  default: () => [],
});
</script>

<template>
  <div>
    <!-- <FieldGroup :fields="[]" /> -->

    <Form :fields="form" />

    <!-- {{ name }} / {{ phone }}
    <Field :label="'tester'" as="text" />
    <Field
      :label="'tester'"
      as="checkbox"
      name="ch1"
      value="tester"
      v-model="name"
    />
    <Field
      :label="'tester'"
      as="radio"
      name="tester"
      value="dog"
      v-model="phone"
    />
    <Field
      :label="'tester'"
      as="radio"
      name="tester"
      value="cat"
      v-model="phone"
    />
    <Field
      :label="'tester'"
      as="select"
      :options="[
        { label: 'One', value: 'One' },
        { label: 'Two', value: 'Two' },
        { label: 'None' },
      ]"
    /> -->

    <!-- <button></button> -->
  </div>
</template>

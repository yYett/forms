<template>
  <div>
    Nuxt module playground!

    <FieldInput label="aaaaaaaaaaaaaaa" required :min-length="5" />
  </div>
</template>

<script setup>
import FieldInput from "../dist/runtime/base/components/FieldInput.vue";
</script>

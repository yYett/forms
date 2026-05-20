<script setup lang="ts">
import { ref } from "vue";
import type { Field } from "../types/form";

const props = defineProps<{
  // data: Step | Group = Field[];
}>();

// map uniquer id for each fucker

const state = ref<any>({});

let test = [
  {
    as: "text",
    label: "Name",
    type: "text",
    name: "name",
    errors: {
      empty: "is mepty",
      invalid: "is invalid",
    },
  },
];

// load: API, if parent only cahnge when parent updates, else fetch on mounted
// show: handle visibility

const x = {
  fields: [...test],
  deps: [
    {
      self: "country",
      action: "fetch",
      handler: "loadCountries",
    },
    {
      parent: "country",
      self: "district",
      action: "fetch",
      handler: "loadDistricts",
    },
    {
      parent: "district",
      self: "city",
      action: "fetch",
      handler: "loadCities",
    },
    {
      parent: "district",
      self: "event-porto",
      action: "show",
      // when: (values) => "conditions",
    },
  ],
};
// map props // hwat if output an fn to root to pass the maping...
// this way allaws to make custom maping for any DTO
const map: Field[] = [
  {
    as: "text",
    label: "Name",
    type: "text",
    name: "name",
  },
];

// validator
// const {} = useForm() is step is group or group[]
// const {} = useValidator()

// deps:: goes intro map props form

// steps // groups::
// just set html with an render fn
// const render = () => {
//   return h(Field);
// };

// all stuff in one place, the form
</script>

<template>
  <form novalidate>
    <!-- step 1 -->

    <!-- <button>next</button>
    <button>prev</button> -->
    <button>submit</button>
  </form>
</template>

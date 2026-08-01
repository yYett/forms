<script setup lang="ts">
import { useAsyncData } from "nuxt/app";
import { useEngine } from "../composables/useEngine";

const data = {
  fields: [
    {
      as: "text",
      label: "Session",
      name: "session",
      readonly: true,
      value: {
        action: "fetch",
        args: { api: "/api/session", query: { tester: "123" } },
      },
    },
    {
      as: "select",
      label: "Country",
      name: "country",
      required: true,
      disabled: false,
      visible: true,
      options: {
        action: "fetch",
        args: { api: "/api/countries" },
        default: [],
      },
    },
    {
      as: "text",
      label: "Name",
      name: "name",
      visible: ["notEmpty", "$country"],
      required: true,
      minlength: 2,
      maxlength: 2,
    },
    {
      as: "text",
      label: "Confirm Name",
      name: "confirmName",
      visible: ["notEmpty", "$country"],
      required: true,
      validationRules: [["sameAs", { field: "$name" }]],
    },
    {
      as: "text",
      label: "Email",
      type: "email",
      name: "email",
      required: true,
      maxlength: 80,
    },
    {
      as: "text",
      label: "Phone",
      name: "phone",
      required: true,
      minlength: 8,
      maxlength: 8,
    },
    {
      as: "text",
      label: "Age",
      name: "age",
      type: "number",
      required: false,
      min: 18,
      max: 65,
    },
    {
      as: "text",
      label: "Born",
      name: "born",
      type: "date",
    },
    {
      as: "text",
      label: "work",
      name: "work",
      type: "date",
      validationRules: [["dateAfter", { sibling: "$born" }]],
    },
    // {
    //   as: "text",
    //   label: "NIF",
    //   name: "nif",
    //   visible: ["notEmpty", "$country"],
    //   required: true,
    //   validationRules: [
    //     ["fetch", { api: "/api/check-nif", query: { country: "$country" } }],
    //   ],
    // },
    // {
    //   as: "text",
    //   label: "Plate",
    //   name: "plate",
    //   visible: ["notEmpty", "$country"],
    //   required: true,
    //   pattern: "",
    // },
    // {
    //   as: "select",
    //   label: "City",
    //   name: "city",
    //   visible: true,
    //   options: {
    //     action: "fetch",
    //     guard: ["notEmpty", "$country"],
    //     args: { api: "/api/cities", query: { country: "$country" } },
    //     default: [],
    //   },
    // },
    // {
    //   as: "select",
    //   label: "Event",
    //   name: "event",
    //   visible: true,
    //   options: {
    //     action: "fetch",
    //     guard: ["notEmpty", "$city"],
    //     args: { api: "/api/events", query: { city: "$city" } },
    //     default: [],
    //   },
    // },
    // {
    //   as: "text",
    //   label: "Date",
    //   name: "date",
    //   readonly: true,
    //   visible: ["notEmpty", "$event"],
    // },
    // {
    //   as: "text",
    //   label: "Hour",
    //   name: "hour",
    //   readonly: true,
    //   visible: ["notEmpty", "$event"],
    // },
    // {
    //   as: "text",
    //   label: "Base Price",
    //   name: "basePrice",
    //   required: false,
    //   readonly: true,
    //   visible: ["notEmpty", "$event"],
    // },
    // {
    //   as: "text",
    //   label: "IVA",
    //   name: "iva",
    //   required: false,
    //   readonly: true,
    //   visible: ["notEmpty", "$event"],
    //   value: { action: "calc", args: "" },
    // },
    // {
    //   as: "text",
    //   label: "PVP",
    //   name: "pvp",
    //   required: false,
    //   readonly: true,
    //   visible: ["and", ["notEmpty", "$basePrice"], ["notEmpty", "$iva"]],
    //   value: { action: "calc", args: "$basePrice * $iva" },
    // },
    // {
    //   as: "text",
    //   label: "Coupon",
    //   name: "coupon",
    //   required: false,
    //   readonly: true,
    //   visible: ["notEmpty", "$pvp"],
    // },
  ],
  reactiveRules: [
    {
      guard: ["notEmpty", "$event"],
      action: "fetch",
      args: { api: "/api/events-detail", query: { event: "$event" } },
      assign: {
        date: "$response.eventDate",
        hour: "$response.eventHour",
        basePrice: "$response.price.base",
        iva: "$response.price.iva",
      },
      effects: [{ action: "reset", target: "coupon", value: "" }],
    },
    {
      guard: ["notEmpty", "$Date"],
      action: "validate",
      args: {},
    },
  ],
};

const { fields, state, runNodeRequests, populateState, set } = useEngine(
  data,
  "en",
);

const { data: nodeResults } = await useAsyncData(
  "node-requests",
  runNodeRequests,
);
populateState(nodeResults.value);
</script>

<template>
  <div
    class="tester"
    style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
    "
  >
    <h2 style="grid-column: 1 / -1">Tester</h2>

    <ClientOnly>
      <pre>{{ state }}</pre>
    </ClientOnly>

    <form class="form">
      <Field
        v-for="{ id, ...attributes } in fields"
        :key="id"
        v-model="state[id].value"
        v-bind="{ id, ...attributes, ...state[id] }"
        v-show="state[id].visible"
        @update:modelValue="set($event, id)"
      >
        <!-- <template #meta>
          <pre> {{ { ...attributes, ...state[id] } }}</pre>
        </template> -->
      </Field>
    </form>
  </div>
</template>

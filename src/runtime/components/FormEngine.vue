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
      as: "select",
      label: "City",
      name: "city",
      visible: true,
      options: {
        action: "fetch",
        guard: ["notEmpty", "$country"],
        args: { api: "/api/cities", query: { country: "$country" } },
        default: [],
      },
    },
    {
      as: "select",
      label: "Event",
      name: "event",
      visible: true,
      options: {
        action: "fetch",
        guard: ["notEmpty", "$city"],
        args: { api: "/api/events", query: { city: "$city" } },
        default: [],
      },
    },
    {
      as: "text",
      label: "Date",
      name: "date",
      readonly: true,
      visible: ["notEmpty", "$event"],
    },
    {
      as: "text",
      label: "Hour",
      name: "hour",
      readonly: true,
      visible: ["notEmpty", "$event"],
    },
    {
      as: "text",
      label: "Base Price",
      name: "basePrice",
      required: false,
      readonly: true,
      visible: ["notEmpty", "$event"],
    },
    {
      as: "text",
      label: "IVA",
      name: "iva",
      required: false,
      readonly: true,
      visible: ["notEmpty", "$event"],
      value: { action: "calc", args: "" },
    },
    {
      as: "text",
      label: "PVP",
      name: "pvp",
      required: false,
      readonly: true,
      visible: ["and", ["notEmpty", "$basePrice"], ["notEmpty", "$iva"]],
      value: { action: "calc", args: "$basePrice * $iva" },
    },
    {
      as: "text",
      label: "Coupon",
      name: "coupon",
      required: false,
      readonly: true,
      visible: ["notEmpty", "$pvp"],
    },
  ],
  rules: [
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
  ],
};

const { fields, state, runtime, runNodeRequests, populateState, set } =
  useEngine(data);

const { data: nodeResults } = await useAsyncData(
  "node-requests",
  runNodeRequests,
);
populateState(nodeResults.value);
</script>

<template>
  <div class="form">
    <h2>Tester</h2>

    <ClientOnly>
      <pre>{{ runtime }}</pre>
      <pre>{{ state }}</pre>
    </ClientOnly>

    <Field
      v-for="{ visible, id, ...attributes } in fields"
      key="id"
      v-model="state[id].value"
      v-bind="{ id, ...attributes, ...state[id] }"
      v-show="state[id].visible"
      @update:modelValue="set($event, id)"
    >
      <!-- <template #meta>
        <pre> {{ { ...attributes, ...state[id] } }}</pre>
      </template> -->
      <!-- slots -->
    </Field>
  </div>
</template>

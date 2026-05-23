<script setup lang="ts">
import { useAsyncData, useFetch } from "nuxt/app";
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    fields: any[];
  }>(),
  {},
);

const state = ref<any>({});

const registryHandlers: any = {
  loadPlanets: (ctx: any) => [{ label: "Venus", value: "sspv" }],
  loadCountries: (ctx: any) => $fetch("/api/countries"),
};

const { data } = await useAsyncData("onMounted", async () => {
  const keys = props.fields.reduce<string[]>((acc, field) => {
    if (field?.deps?.load && field?.deps?.load?.parent === undefined) {
      acc.push(field.deps.load.handler); // string key only
    }
    return acc;
  }, []);

  const entries = await Promise.all(
    keys.map(async (key) => {
      const fn = registryHandlers[key];
      if (!fn) return [key, null] as const;
      return [key, await fn()] as const;
    }),
  );

  return Object.fromEntries(entries);
});

const getField = computed(() => {
  return props.fields.map((item) => {
    if (item.as == "select" && !item.options.length) {
      console.log("item.load.handl", item?.deps?.load?.handler);

      const options = data.value?.[item?.deps?.load?.handler];
      return { ...item, options: options || [] };
    }

    return item;
  });
});
</script>

<template>
  <form novalidate>
    <pre>{{ state }}</pre>
    <pre>{{ data }}</pre>

    <!-- step 1 -->
    <Field
      v-for="(item, i) in getField"
      :key="i"
      v-bind="item"
      v-model="state[item.id]"
    />

    <!-- <button>next</button>
    <button>prev</button> -->
    <button>submit</button>
  </form>
</template>

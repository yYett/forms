import { useData } from "./useData";
import { useGraph } from "./useGraph";
import { useNode } from "./useNode";
import { useExecutor } from "./useExecutor";
import { computed, reactive } from "vue";
import { useValidation } from "./useValidation";

export function useEngine(data: any, language: string) {
  const { fields } = useData(data);
  const { nodes } = useNode(fields);
  const { graph } = useGraph(nodes);

  const state = reactive<Record<string, any>>({});
  const fieldsById = new Map(fields.map((field: any) => [field.id, field]));

  for (let field of fields) {
    let runtime: any = {
      name: field.name,
    };

    for (let prop of field.$nodes) {
      const node = nodes.get(`${field.id}.${prop}`);
      if (!node) continue;

      runtime[prop] = node?.default;
    }

    runtime.value ??= ""; // set value from query param / cookies / whatever
    runtime.visible ??= true;
    state[field.id] = runtime;
  }

  const runtime = computed(() => {
    return Object.values(state).reduce((acc: any, { name, value }) => {
      if (!(name in acc)) acc[name] = value;
      else acc[name] = [].concat(acc[name], value);
      return acc;
    }, {});
  });

  console.log("state", state);

  /**
   * Init path: batch-executes all $nodes.
   * Uses executeNode so expr, fetch, and future strategies all work without extra code.
   */
  const runNodeRequests = async (): Promise<Record<string, any>> => {
    const tasks = (graph.$nodes ?? []).flatMap((key: string) => {
      const node = nodes.get(key);
      if (!node) return [];

      const task = executeNode(key, node);
      return task ? [task] : [];
    });

    if (!tasks.length) return {};

    const results = await Promise.allSettled(tasks);
    const responseData: Record<string, any> = {};

    for (const result of results) {
      if (result.status === "fulfilled" && result.value) {
        const [key, data] = result.value;
        responseData[key] = data;
      } else if (result.status === "rejected") {
        console.warn("[runNodeRequests] node failed:", result.reason);
      }
    }

    return responseData;
  };

  const populateState = (data: any) => {
    for (const key in data) {
      const node = nodes.get(key);
      if (!node) continue;
      state[node.self][node.prop] = data[key];
    }
  };

  const { executeNode, execute } = useExecutor(nodes, state, runtime);
  const { validate, revalidateDeps } = useValidation(fields, runtime, language);

  const set = (value: any, id: string): void => {
    state[id].value = value;

    const field = fieldsById.get(id);
    console.log(value, id, field);

    if (!field) return;

    const errorMessage = validate(id, value, field);
    console.log("errorMessage", errorMessage);

    if (errorMessage) {
      state[id].errorMessage = errorMessage;
      return;
    }

    state[id].errorMessage = "";

    const deps = graph[state[id].name];
    execute(deps);

    revalidateDeps(state[id].name, fieldsById, (depID, depErrorMsg) => {
      state[depID].errorMessage = depErrorMsg ? depErrorMsg : "";
    });
  };

  return {
    fields,
    state,
    runNodeRequests,
    populateState,
    set,
  };
}

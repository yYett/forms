import { useData } from "./useData";
import { useGraph } from "./useGraph";
import { useNode } from "./useNode";
import { useExecutor } from "./useExecutor";
import { reactive } from "vue";

export function useEngine(data: any) {
  const { fields } = useData(data);
  const { nodes } = useNode(fields);
  const { graph } = useGraph(nodes);

  const state = reactive<Record<string, any>>({});

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

  const { resolveGuard, buildRequest, execute } = useExecutor(nodes, state);

  const runNodeRequests = async () => {
    const tasks = (graph.$requests ?? []).flatMap((key) => {
      const node = nodes.get(key);
      if (!node || !resolveGuard(node.guard)) return [];

      const taskFn = buildRequest(node);
      if (!taskFn) return [];

      // Execute the function immediately and bundle the result with its key
      return [taskFn().then((res) => [key, res] as const)];
    });

    if (!tasks.length) return {};

    const results = await Promise.allSettled(tasks);
    const responseData: Record<string, any> = {};

    for (const result of results) {
      if (result.status === "fulfilled") {
        const [key, data] = result.value;
        responseData[key] = data;
      } else {
        console.warn(`[runNodeRequests] Node request failed:`, result.reason);
      }
    }

    return responseData;
  };

  const populateState = (data: any) => {
    for (let key in data) {
      const node = nodes.get(key);
      state[node.self][node.prop] = data[key];
    }
  };

  const set = (value: any, id: string): void => {
    state[id].value = value;
    const deps = graph[state[id].name];
    execute(deps);
  };

  return {
    fields,
    state,
    runNodeRequests,
    populateState,
    set,
  };
}

import { computed } from "vue";
import { evaluateExpr } from "../utils/expr";

export function useExecutor(
  nodes: Map<string, any>,
  state: Record<string, any>,
) {
  const runtime = computed(() => {
    return Object.values(state).reduce((acc: any, { name, value }) => {
      if (!(name in acc)) acc[name] = value;
      else acc[name] = [].concat(acc[name], value);
      return acc;
    }, {});
  });

  const registry: Record<string, any> = {
    fetch: async (node: any) => {
      const request = buildRequest(node);
      if (!request) return;

      return request();
    },
  };

  const execute = (deps: string[]): void => {
    for (const key of deps) {
      const node = nodes.get(key);
      if (!node || !resolveGuard(node.guard)) continue;

      const fn = registry[node.strategy];
      if (!fn) continue;

      fn(node)
        .then((res: any) => {
          state[node.self][node.prop] = res;
          // reset or some callback ??
        })
        .catch(() => console.warn("node failed:", key));
    }
  };

  function resolveGuard(guard: any): boolean {
    if (!guard) return true;
    return evaluateExpr(guard, runtime.value);
  }

  function interpolate(params: any, values: Record<string, any>): any {
    if (typeof params === "string" && params.startsWith("$")) {
      return values[params.slice(1)];
    }

    if (
      params !== null &&
      typeof params === "object" &&
      !Array.isArray(params)
    ) {
      return Object.fromEntries(
        Object.entries(params)
          .map(([key, value]) => [key, interpolate(value, values)])
          .filter(
            ([_, value]) =>
              value !== null && value !== undefined && value !== "",
          ),
      );
    }

    return params;
  }

  function buildRequest(node: any) {
    const api = node.args?.api;
    if (!api) return null;

    const query = interpolate(node.args.query ?? {}, runtime.value);

    return () =>
      $fetch(api, {
        method: "GET",
        query,
      });
  }

  return { runtime, resolveGuard, buildRequest, execute };
}

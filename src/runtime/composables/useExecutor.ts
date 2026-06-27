import { evaluateExpr } from "../utils/expr";
import { computed } from "vue";

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

  const registry: Record<string, (node: any) => any> = {
    fetch: (node: any) => {
      const request = buildRequest(node);
      return request ? request() : undefined;
    },
    expr: (node: any) => evaluateExpr(node.args, runtime.value),
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
    return () => $fetch(api, { method: "GET", query });
  }

  /**
   * Shared primitive. Resolves guard, dispatches strategy, writes result to state.
   * Returns a Promise<[key, result]> for batching, or null if guard fails / no strategy.
   */
  function executeNode(key: string, node: any): Promise<any> | null {
    if (!resolveGuard(node.guard)) return null;

    const fn = registry[node.strategy];
    if (!fn) return null;

    return Promise.resolve(fn(node))
      .then((res) => [key, res] as const)
      .catch((err) => {
        console.warn("node failed:", key, err);
        return null;
      });
  }

  /**
   * Reactive path: called when a field value changes.
   * Fires executeNode for each dep, writes results immediately as they resolve.
   */
  const execute = (deps: string[]): void => {
    for (const key of deps) {
      const node = nodes.get(key);
      if (!node) continue;

      const task = executeNode(key, node);
      if (!task) continue;

      task.then((result) => {
        if (!result) return;
        const [, res] = result;
        state[node.self][node.prop] = res;
      });
    }
  };

  return { runtime, resolveGuard, buildRequest, executeNode, execute };
}

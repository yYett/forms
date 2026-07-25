export function useGraph(nodes: Map<string, any>) {
  const graph = Array.from(nodes).reduce(
    (acc: Record<string, string[]>, [key, node]) => {
      for (const dep of node.deps) {
        acc[dep] ??= [];
        acc[dep].push(key);
      }

      acc["$nodes"]!.push(key);

      return acc;
    },
    { $nodes: [] },
  );

  console.log("graph", graph);

  return { graph };
}

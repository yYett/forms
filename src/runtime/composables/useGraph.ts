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

// runtime {
//   name1: {
//     value: "teal";
//     name: 'name'
//   }
//   phone2: {
//     value: "123456789";
//     name: "phone"
//   }
//   name3: {
//     value: "blue";
//     name: 'name'
//   }
// }

// used for field
// v-model="runtime[field.id].value"
// update:modelValue="..."

// create event when user leave field and update others/execute deps
// fieldChanged(id){
//   let name = runtime(id).name
//   get graph
//   forach graph item execute deps

// }

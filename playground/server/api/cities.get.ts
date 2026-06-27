import { getQuery } from "h3";

export default eventHandler((event) => {
  const { country } = getQuery(event);

  const cities = {
    pt: [
      { label: "", value: "" },
      { label: "Lisbon", value: "lisbon" },
      { label: "Porto", value: "porto" },
      { label: "Braga", value: "braga" },
    ],

    es: [
      { label: "", value: "" },
      { label: "Madrid", value: "madrid" },
      { label: "Barcelona", value: "barcelona" },
      { label: "Valencia", value: "valencia" },
    ],

    fr: [
      { label: "", value: "" },
      { label: "Paris", value: "paris" },
      { label: "Lyon", value: "lyon" },
      { label: "Marseille", value: "marseille" },
    ],
  };

  return cities[country as keyof typeof cities] ?? [];
});

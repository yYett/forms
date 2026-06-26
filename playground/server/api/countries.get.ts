import { getQuery } from "h3";

export default eventHandler((event) => {
  const countries = [
    { label: "PT", value: "pt" },
    { label: "ES", value: "es" },
    { label: "FR", value: "fr" },
  ];

  return countries;
});

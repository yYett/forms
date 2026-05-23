import { getQuery } from "h3";

export default eventHandler((event) => {
  const { city } = getQuery(event);

  const eventsByCity = {
    lisbon: [
      {
        label: "Web Summit",
        value: "web-summit",
      },
      {
        label: "Half Marathon",
        value: "half-marathon",
      },
      {
        label: "Rock in Rio",
        value: "rock-in-rio",
      },
    ],

    porto: [
      {
        label: "NOS Primavera",
        value: "nos-primavera",
      },
      {
        label: "Half Marathon",
        value: "half-marathon",
      },
      {
        label: "Porto Tech Summit",
        value: "porto-tech-summit",
      },
    ],

    paris: [
      {
        label: "Paris Marathon",
        value: "paris-marathon",
      },
      {
        label: "VivaTech",
        value: "vivatech",
      },
    ],
  };

  return eventsByCity[city as keyof object] ?? [];
});

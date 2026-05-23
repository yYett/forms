import { getQuery } from "h3";

export default eventHandler((event) => {
  const { city, event: selectedEvent } = getQuery(event);

  const places = [
    {
      city: "lisbon",
      event: "web-summit",
      label: "Altice Arena",
      value: "altice-arena",
    },
    {
      city: "lisbon",
      event: "web-summit",
      label: "FIL",
      value: "fil",
    },
    {
      city: "lisbon",
      event: "half-marathon",
      label: "Belém",
      value: "belem",
    },
    {
      city: "lisbon",
      event: "half-marathon",
      label: "Parque das Nações",
      value: "parque-das-nacoes",
    },
    {
      city: "porto",
      event: "half-marathon",
      label: "Ribeira",
      value: "ribeira",
    },
    {
      city: "porto",
      event: "nos-primavera",
      label: "Parque da Cidade",
      value: "parque-da-cidade",
    },
  ];

  return places
    .filter((place) => place.city === city && place.event === selectedEvent)
    .map(({ label, value }) => ({
      label,
      value,
    }));
});

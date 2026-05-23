import { getQuery } from "h3";

export default eventHandler((event) => {
  return [
    {
      id: 0,
      as: "text",
      label: "Name",
      name: "name",
      type: "text",
    },
    {
      id: 1,
      as: "select",
      label: "Country",
      name: "country",
      options: [],
      deps: {
        load: {
          handler: "loadPlanets",
        },
        validate: {
          //
        },
      },
    },
    {
      id: 1,
      as: "select",
      label: "Country",
      name: "country",
      options: [],
      deps: {
        load: {
          handler: "loadCountries",
        },
        validate: {
          //
        },
      },
    },
    {
      id: 2,
      as: "select",
      label: "City",
      name: "city",
      options: [],
      deps: {
        load: {
          handler: "loadCities",
          parent: 1,
        },
      },
    },
    {
      id: 3,
      as: "select",
      label: "Event",
      name: "event",
      options: [],
      deps: {
        load: {
          handler: "loadEvents",
          parent: 2,
        },
      },
    },
    {
      id: 4,
      as: "select",
      label: "Place",
      name: "place",
      options: [],
      deps: {
        load: {
          parent: [2, 3],
          handler: "loadPlaces",
        },
      },
    },
    {
      id: 5,
      as: "text",
      label: "Note",
      name: "notes",
      type: "text",
      deps: {
        visibility: [
          [
            {
              parent: 1,
              operator: "equal",
              value: "pt",
            },
            {
              parent: 4,
              operator: "notEmpty",
            },
          ],
        ],
      },
    },
  ];
});

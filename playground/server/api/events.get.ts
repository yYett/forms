import { getQuery } from "h3";

export default eventHandler((event) => {
  const { city } = getQuery(event);

  const events = {
    lisbon: [
      { label: "Web Summit", value: "web-summit" },
      { label: "Rock in Rio Lisboa", value: "rock-in-rio-lisboa" },
    ],

    porto: [
      { label: "São João", value: "sao-joao" },
      { label: "Porto Wine Fest", value: "porto-wine-fest" },
    ],

    braga: [
      { label: "Braga Romana", value: "braga-romana" },
      { label: "Noite Branca", value: "noite-branca" },
    ],

    madrid: [
      { label: "Mad Cool", value: "mad-cool" },
      { label: "Madrid Marathon", value: "madrid-marathon" },
    ],

    barcelona: [
      { label: "Primavera Sound", value: "primavera-sound" },
      { label: "Sónar", value: "sonar" },
    ],

    valencia: [
      { label: "Las Fallas", value: "las-fallas" },
      { label: "Marathon Valencia", value: "valencia-marathon" },
    ],

    paris: [
      { label: "Paris Fashion Week", value: "paris-fashion-week" },
      { label: "Roland-Garros", value: "roland-garros" },
    ],

    lyon: [
      { label: "Fête des Lumières", value: "fete-des-lumieres" },
      { label: "Nuits de Fourvière", value: "nuits-de-fourviere" },
    ],

    marseille: [
      { label: "Marsatac", value: "marsatac" },
      { label: "Fiesta des Suds", value: "fiesta-des-suds" },
    ],
  };

  return events[city as keyof typeof events] ?? [];
});

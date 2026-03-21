import type { ErrorMessages } from "../types";

//#region Localized Error Messages

const PT_MESSAGES: ErrorMessages = {
  formsGeneralError: "Este campo é obrigatório.",
  formsEmptyField: "",

  formsMinLength: "O campo tem que ter no mínimo {#minLength} caracteres",
  formsMaxLength: "O campo tem que ter no máximo {#maxLength} caracteres",
  formsMinAndMaxLength:
    "O campo tem que ter entre {#minLength} e {#maxLength} caracteres",
  formsExactLength: "O campo tem que ter {#minLength} caracteres",

  formsMinDate: "Selecione uma data depois de {#minDate}.",
  formsMaxDate: "Seleciona uma data antes de {#maxDate}.",
  formsMinAndMaxDate: "Seleciona uma data entre {#minDate} e {#maxDate}",
  formsInvalidDate: "Coloque uma data válida.",

  formsMinSelections: "Tem que selecionar pelo menos {#minSelected} opções",
  formsMaxSelections: "Só pode selecionar {#maxSelected} opções",
  formsMinAndMaxSelections: "Tem que selecionar {#minSelected} opções",
  formsExactSelections: "Tem que selecionar {#minSelected} opções",

  formsInvalidEmail: "",
  formsInvalidPhoneNumber: "",
  formsInvalidPostalCode: "",

  // formsWarningErrorTitle: "Ocorreu um erro ao submeter o formulário.",
  // formsWarningErrorDescription:
  //   "Por favor tente submeter novamente mais tarde.",
  // formsWarningErrorIcon: "",
  // formsWarningErrorDuration: "6",

  // formsWarningSuccessTitle: "Formulário submetido com sucesso!",
  // formsWarningSuccessDescription:
  //   "Obrigado pelo seu contacto. Entraremos em contacto consigo em breve.",
  // formsWarningSuccessIcon: "",
  // formsWarningSuccessDuration: "6",
};

const EN_MESSAGES: ErrorMessages = {
  formsGeneralError: "This field is required.",
  formsEmptyField: "",

  formsMinLength: "Field must be at least {#minLength} characters",
  formsMaxLength: "Field must be at most {#maxLength} characters",
  formsMinAndMaxLength:
    "Field must be between {#minLength} and {#maxLength} characters",
  formsExactLength: "Field must be exactly {#minLength} characters",

  formsMinDate: "Select a date after {#minDate}.",
  formsMaxDate: "Select a date before {#maxDate}.",
  formsMinAndMaxDate: "Select a date between {#minDate} and {#maxDate}",
  formsInvalidDate: "Please enter a valid date.",

  formsMinSelections: "Please select at least {#minSelected} options",
  formsMaxSelections: "You can only select {#maxSelected} options",
  formsMinAndMaxSelections: "Please select {#minSelected} options",
  formsExactSelections: "Please select exactly {#minSelected} options",

  formsInvalidEmail: "",
  formsInvalidPhoneNumber: "",
  formsInvalidPostalCode: "",
};

const ES_MESSAGES: ErrorMessages = {
  formsGeneralError: "Este campo es obligatorio.",
  formsEmptyField: "",

  formsMinLength: "El campo debe tener al menos {#minLength} caracteres",
  formsMaxLength: "El campo debe tener como máximo {#maxLength} caracteres",
  formsMinAndMaxLength:
    "El campo debe tener entre {#minLength} y {#maxLength} caracteres",
  formsExactLength: "El campo debe tener exactamente {#minLength} caracteres",

  formsMinDate: "Selecciona una fecha después de {#minDate}.",
  formsMaxDate: "Selecciona una fecha antes de {#maxDate}.",
  formsMinAndMaxDate: "Selecciona una fecha entre {#minDate} y {#maxDate}",
  formsInvalidDate: "Por favor introduce una fecha válida.",

  formsMinSelections: "Debes seleccionar al menos {#minSelected} opciones",
  formsMaxSelections: "Solo puedes seleccionar {#maxSelected} opciones",
  formsMinAndMaxSelections: "Debes seleccionar {#minSelected} opciones",
  formsExactSelections: "Debes seleccionar exactamente {#minSelected} opciones",

  formsInvalidEmail: "",
  formsInvalidPhoneNumber: "",
  formsInvalidPostalCode: "",
};

const FR_MESSAGES: ErrorMessages = {
  formsGeneralError: "Ce champ est obligatoire.",
  formsEmptyField: "",

  formsMinLength: "Le champ doit comporter au moins {#minLength} caractères",
  formsMaxLength: "Le champ doit comporter au maximum {#maxLength} caractères",
  formsMinAndMaxLength:
    "Le champ doit comporter entre {#minLength} et {#maxLength} caractères",
  formsExactLength:
    "Le champ doit comporter exactement {#minLength} caractères",

  formsMinDate: "Sélectionnez une date après le {#minDate}.",
  formsMaxDate: "Sélectionnez une date avant le {#maxDate}.",
  formsMinAndMaxDate: "Sélectionnez une date entre {#minDate} et {#maxDate}",
  formsInvalidDate: "Veuillez entrer une date valide.",

  formsMinSelections: "Veuillez sélectionner au moins {#minSelected} options",
  formsMaxSelections: "Vous ne pouvez sélectionner que {#maxSelected} options",
  formsMinAndMaxSelections: "Veuillez sélectionner {#minSelected} options",
  formsExactSelections:
    "Veuillez sélectionner exactement {#minSelected} options",

  formsInvalidEmail: "",
  formsInvalidPhoneNumber: "",
  formsInvalidPostalCode: "",
};

//#endregion

const controller: Record<string, ErrorMessages> = {
  pt: PT_MESSAGES,
  en: EN_MESSAGES,
  es: ES_MESSAGES,
  fr: FR_MESSAGES,
};

export function getMessages(lang: string = "pt"): ErrorMessages {
  return controller[lang] ?? controller["pt"]!;
}

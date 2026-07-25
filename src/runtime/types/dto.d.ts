export type ConditionalLogicDto = {
  property: string; // id
  condition: "equal";
  value: string;
  id: string; // curent field id
};

export type ComponentDto<Key extends string, Props = {}> = {
  key: Key;
  uniqueId: string;
  width: number;
  id: string;
  name: string;
  label: string;
  required: boolean;
  dataLayer: boolean;
  conditionalLogic: ConditionalLogicDto[][];
} & Props;

export type SubHeadingDto = {
  id: string;
  key: string;
  uniqueId: string;
  width: number;
  label: string;
  conditionalLogic: ConditionalLogicDto[][];
  labelTag: string;
};

export type InputDto = ComponentDto<
  "Input",
  {
    type: string;
    minLength: 0;
    maxLength: 0;
    placeholder: string;
  }
>;

export type SelectDto = ComponentDto<
  "Select",
  {
    placeholder: string;
    options: { value: string; label: string }[];
  }
>;

export type TextareaDto = ComponentDto<
  "Textarea",
  {
    maxLength: 0;
    minLength: 0;
    placeholder: string;
  }
>;

export type SingleCheckboxDto = ComponentDto<"SingleCheckbox">;

export type FormSettingsDto = {
  formsGeneralError: string;
  formsEmptyField: string;

  formsInvalidEmail: string;
  formsInvalidPostalCode: string;
  formsInvalidPhoneNumber: string;

  formsMinLength: string;
  formsMaxLength: string;
  formsExactLength: string;
  formsMinAndMaxLength: string;

  formsMinSelections: string;
  formsMaxSelections: string;
  formsExactSelections: string;
  formsMinAndMaxSelections: string;

  formsMinDate: string;
  formsMaxDate: string;
  formsInvalidDate: string;
  formsMinAndMaxDate: string;

  formsWarningSuccessTitle: string;
  formsWarningSuccessDescription: string;
  formsWarningSuccessIcon: string;
  formsWarningSuccessDuration: string;

  formsWarningErrorTitle: string;
  formsWarningErrorDescription: string;
  formsWarningErrorIcon: string;
  formsWarningErrorDuration: string;
};

export type FormDto = {
  id: string;
  name: string;
  description: string;

  relationships: [];
  components: (
    | SubHeadingDto
    | InputDto
    | SelectDto
    | TextareaDto
    | SingleCheckboxDto
  )[];

  redirect: boolean;
  redirectUrl: string;

  submitButton: {
    text: string;
    type: string;
    loadingText: string;
  };

  dataLayerEventName: string;

  settings: Record<keyof FormSettingsDto, string>;
};

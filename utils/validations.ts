import * as Yup from "yup";
export const REQUIRED_FIELD_ERROR = "Required";
export const REQUIRED_FIELD_TOO_SHORT_TEXT = "Too Short!";
export const REQUIRED_FIELD_TOO_LONG_TEXT = "Too Long!";

export const NAME_MIN_LENGTH = 2;
export const PASSWORD_MIN_LENGTH = 6;

export const validation = {
  email: Yup.string().email("Invalid Email").required(REQUIRED_FIELD_ERROR),
  name: Yup.string()
    .min(2, REQUIRED_FIELD_TOO_SHORT_TEXT)
    .max(2000, REQUIRED_FIELD_TOO_LONG_TEXT),
  description: Yup.string().max(500, REQUIRED_FIELD_TOO_LONG_TEXT),
  password: Yup.string()
    .min(6, REQUIRED_FIELD_TOO_SHORT_TEXT)
    .max(50, REQUIRED_FIELD_TOO_LONG_TEXT)
    .required(REQUIRED_FIELD_ERROR),
};

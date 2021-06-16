import { UseToastOptions } from "@chakra-ui/react";
import { NextApiRequest } from "next";
import * as Yup from "yup";
import { ColumnType, ColumnItemType } from "../types";

export const reorder = (
  list: ColumnItemType[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function reorderList(
  columns: ColumnType[],
  startIndex: number,
  endIndex: number
): ColumnType[] {
  const result = Array.from(columns);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

/**
 * Moves an item from one list to another list.
 */
export const move = (
  sourceCol: ColumnItemType[] = [],
  destCol: ColumnItemType[] = [],
  sourceIndex: number,
  destinationIndex: number,
  sourceColIndex: number,
  destColIndex: number
): { [key: number]: ColumnItemType[] } => {
  const sourceClone = Array.from(sourceCol);
  const destClone = Array.from(destCol);
  const [removed] = sourceClone.splice(sourceIndex, 1);

  destClone.splice(destinationIndex, 0, removed);

  const result = {};
  result[sourceColIndex] = sourceClone;
  result[destColIndex] = destClone;

  return result;
};

export const REQUIRED_FIELD_ERROR = "Required";
export const REQUIRED_FIELD_TOO_SHORT_TEXT = "Too Short!";
export const REQUIRED_FIELD_TOO_LONG_TEXT = "Too Long!";

export const NAME_MIN_LENGTH = 2;
export const PASSWORD_MIN_LENGTH = 6;

export const validation = {
  email: Yup.string().email("Invalid Email").required(REQUIRED_FIELD_ERROR),
  name: Yup.string()
    .min(1, REQUIRED_FIELD_TOO_SHORT_TEXT)
    .max(2000, REQUIRED_FIELD_TOO_LONG_TEXT),
  description: Yup.string().max(500, REQUIRED_FIELD_TOO_LONG_TEXT),
  password: Yup.string()
    .min(6, REQUIRED_FIELD_TOO_SHORT_TEXT)
    .max(50, REQUIRED_FIELD_TOO_LONG_TEXT)
    .required(REQUIRED_FIELD_ERROR),
};

export const getAbsoluteURL = (url: string, req: any = null) => {
  let host;
  if (req !== null) {
    host = req.headers.host;
  } else {
    if (typeof window === "undefined") {
      throw new Error(
        'The "req" parameter must be provided if on the server side.'
      );
    }
    host = window.location.host;
  }
  const isLocalhost = host.indexOf("localhost") === 0;
  const protocol = isLocalhost ? "http" : "https";
  return `${protocol}://${host}${url}`;
};

export function toastConfig(
  title: string,
  status: "success" | "error" | "info" | "warning",
  description = ""
): UseToastOptions {
  return {
    title,
    position: "bottom",
    description,
    status,
    duration: 2000,
    isClosable: true,
  };
}

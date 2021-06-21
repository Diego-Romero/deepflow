import { UseToastOptions } from "@chakra-ui/react";
import { NextApiRequest } from "next";
import * as Yup from "yup";
import { TemplateTypes } from "../components/CreateBoardModal";
import { Column, ColumnItem } from "../types";

export const reorder = (
  list: ColumnItem[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function reorderList(
  columns: Column[],
  startIndex: number,
  endIndex: number
): Column[] {
  const result = Array.from(columns);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export function createTemplateColumns(template: TemplateTypes): Column[] {
  let columns: Column[] = [];
  switch (template) {
    case TemplateTypes.todoDoingDone:
      columns = [
        {
          name: "to do",
          items: [{ name: "to do item", createdAt: Date.now() }],
        },
        {
          name: "doing",
          items: [
            { name: "doing item", createdAt: Date.now() },
            { name: "doing item 2", createdAt: Date.now() },
          ],
        },
        {
          name: "done",
          items: [
            { name: "done item", createdAt: Date.now() },
            { name: "done item 2", createdAt: Date.now() },
          ],
        },
      ];
      break;
    case TemplateTypes.weekdays:
      columns = [
        {
          name: "Monday",
          items: [
            { name: "Monday item 1", createdAt: Date.now() },
            { name: "Monday item 2", createdAt: Date.now() },
            { name: "Monday item 3", createdAt: Date.now() },
          ],
        },
        {
          name: "Tuesday",
          items: [{ name: "Tuesday item 1", createdAt: Date.now() }],
        },
        {
          name: "Wednesday",
          items: [{ name: "Wednesday item 1", createdAt: Date.now() }],
        },
        {
          name: "Thursday",
          items: [{ name: "Thursday item 1", createdAt: Date.now() }],
        },
        {
          name: "Friday",
          items: [{ name: "Friday item 1", createdAt: Date.now() }],
        },
        {
          name: "Saturday",
          items: [{ name: "Saturday item 1", createdAt: Date.now() }],
        },
        {
          name: "Sunday",
          items: [{ name: "Sunday item 1", createdAt: Date.now() }],
        },
      ];
      break;
    case TemplateTypes.blank:
      columns = [];
      break;
  }

  return columns;
}

/**
 * Moves an item from one list to another list.
 */
export const move = (
  sourceCol: ColumnItem[] = [],
  destCol: ColumnItem[] = [],
  sourceIndex: number,
  destinationIndex: number,
  sourceColIndex: number,
  destColIndex: number
): { [key: number]: ColumnItem[] } => {
  const sourceClone = Array.from(sourceCol);
  const destClone = Array.from(destCol);
  const [removed] = sourceClone.splice(sourceIndex, 1);

  destClone.splice(destinationIndex, 0, removed);

  const result = {};
  result[sourceColIndex] = sourceClone;
  result[destColIndex] = destClone;

  return result;
};

export const formatWatchTime = (n: number) => {
  const s = n.toString();
  return s.length === 1 ? `0${s}` : s;
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

import { UseToastOptions } from "@chakra-ui/react";

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

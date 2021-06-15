import { Box } from "@chakra-ui/react";
import React from "react";

interface Props {
  maxHeight?: string;
}

export const Card: React.FC<Props> = ({ children, maxHeight = "auto" }) => (
  <Box
    borderStyle="solid"
    borderRadius="12px"
    maxHeight={maxHeight}
    overflow="auto"
    p={6}
    shadow="md"
    borderColor="gray.200"
    borderWidth="1px"
  >
    {children}
  </Box>
);

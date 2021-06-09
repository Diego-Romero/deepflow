import { CircularProgress, Flex, Heading } from "@chakra-ui/react";
import React from "react";

const FullPageLoader = () => (
  <Flex
    flexDir="column"
    textAlign="center"
    alignItems="center"
    justifyContent="center"
    width="100%"
    height="100%"
  >
    <CircularProgress isIndeterminate color="purple.500" />
    <Heading mt={4} size="md">
      Loading
    </Heading>
  </Flex>
);

export default FullPageLoader;

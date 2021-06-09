import { EmailIcon } from "@chakra-ui/icons";
import { Flex, Heading } from "@chakra-ui/layout";
import { Box, IconButton, Link, Stack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { ContactFormModal } from "./ContactFormModal";

export const Footer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Flex
        width="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        p="4"
        bgGradient="linear(to-r, cyan.700,purple.500)"
        boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.1),0 1px 2px 0 rgba(0, 0, 0, 0.06)"
        color="white"
      >
        <Stack
          direction={["column", "column", "row"]}
          alignItems="center"
          spacing={4}
        >
          <Heading size="sm">
            Made with 🍹 {" "}
            <Link
              href="https://www.linkedin.com/in/dev-diego-romero/"
              isExternal
              textDecor="underline"
            >
              by Diego Romero
            </Link>
          </Heading>
          <IconButton
            variant="outline"
            isRound
            colorScheme="white"
            size="sm"
            aria-label="get in touch"
            onClick={onOpen}
            icon={<EmailIcon />}
          />
        </Stack>
      </Flex>
      <ContactFormModal modalOpen={isOpen} modalClose={onClose} />
    </Box>
  );
};

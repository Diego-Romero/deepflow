import { EmailIcon } from '@chakra-ui/icons';
import { Flex, Heading } from '@chakra-ui/layout';
import {
  Badge,
  Box,
  IconButton,
  Link,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { ContactFormModal } from './ContactFormModal';

export const Footer: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Flex
        width="100%"
        textAlign="center"
        alignContent="center"
        justifyContent="center"
        p="3"
        // bgGradient="linear(to-r, cyan.700,purple.500)"
        bgColor="gray.800"
        color="white"
      >
        <Stack direction={'row'} alignItems="center" spacing={4}>
          <Badge fontSize="xs" variant="subtle" colorScheme="green">
            Beta
          </Badge>
          <Heading size="xs">
            <Link
              href="https://www.linkedin.com/in/dev-diego-romero/"
              isExternal
              textDecor="underline"
            >
              Made by Diego Romero
            </Link>
          </Heading>
          <IconButton
            variant="outline"
            isRound
            colorScheme="white"
            size="xs"
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

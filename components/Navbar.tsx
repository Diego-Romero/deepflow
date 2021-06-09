import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { IoMdHome, IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { FaRegKeyboard } from "react-icons/fa";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";

export const NavBar: React.FC = () => {
  const router = useRouter();
  const AuthUser = useAuthUser();

  return (
    <Flex
      direction="row"
      color="white"
      bgGradient="linear(to-r, cyan.700,purple.500)"
      p={4}
      align="center"
      justify="space-between"
    >
      <Box>
        {AuthUser.email ? (
          <>
            <Tooltip label="Keyboard shortcuts" aria-label="Keyboard shortcuts">
              <IconButton
                ml={4}
                display={["none", "none", "none", "inline-flex"]}
                size="md"
                variant="ghost"
                color="current"
                fontSize="2xl"
                // onClick={onOpen}
                icon={<FaRegKeyboard />}
                aria-label={`Keyboard shortcuts`}
              />
            </Tooltip>
            <Tooltip label="Go to lists" aria-label="go to lists">
              <IconButton
                size="md"
                variant="ghost"
                color="current"
                fontSize="2xl"
                icon={<AiOutlineUnorderedList />}
                aria-label={`Go to lists`}
              />
            </Tooltip>
          </>
        ) : (
          <IconButton
            size="md"
            variant="ghost"
            color="current"
            fontSize="2xl"
            icon={<IoMdHome />}
            onClick={() => router.push("/")}
            aria-label={`Home`}
          />
        )}
      </Box>
      <HStack>
        <ColorModeSwitcher justifySelf="flex-end" />
        {AuthUser.email ? (
          <>
            <Tooltip label="Logout" aria-label="Logout">
              <IconButton
                size="md"
                variant="ghost"
                color="current"
                fontSize="2xl"
                onClick={() => AuthUser.signOut()}
                icon={<IoMdLogOut />}
                aria-label={`Logout`}
              />
            </Tooltip>
          </>
        ) : null}
      </HStack>
    </Flex>
  );
};

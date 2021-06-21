import { Box, Flex, HStack, IconButton, Tooltip, useDisclosure } from "@chakra-ui/react";
import * as React from "react";
import { IoMdHome, IoMdLogOut } from "react-icons/io";
import { FaListUl } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useAuthUser } from "next-firebase-auth";
import { useRouter } from "next/router";
import config from "../utils/config";
import { KeymapModal } from "./KeymapModal";

export const NavBar: React.FC = () => {
  const router = useRouter();
  const AuthUser = useAuthUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <Tooltip label="Go to dashboard" aria-label="Go to dashboard">
              <IconButton
                size="md"
                variant="ghost"
                color="current"
                fontSize="2xl"
                icon={<MdDashboard />}
                aria-label={`Go to dashboard`}
                onClick={() => router.push(config.routes.dashboard)}
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
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        {AuthUser.email ? (
          <>
            {/* <Tooltip label="Keyboard shortcuts" aria-label="Keyboard shortcuts">
              <IconButton
                ml={4}
                display={["none", "none", "inline-flex"]}
                size="md"
                variant="ghost"
                color="current"
                fontSize="2xl"
                onClick={onOpen}
                icon={<FaRegKeyboard />}
                aria-label={`Keyboard shortcuts`}
              />
            </Tooltip> */}
            <Tooltip label="Logout" aria-label="Logout">
              <IconButton
                size="md"
                variant="ghost"
                color="current"
                fontSize="2xl"
                onClick={() => {
                  AuthUser.signOut();
                }}
                icon={<IoMdLogOut />}
                aria-label={`Logout`}
              />
            </Tooltip>
          </>
        ) : null}
      </HStack>
      <KeymapModal modalOpen={isOpen} modalClose={onClose} />
    </Flex>
  );
};

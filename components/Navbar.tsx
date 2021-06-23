import {
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { IoMdHome, IoMdLogOut } from 'react-icons/io';
import { MdDashboard } from 'react-icons/md';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import config from '../utils/config';
import { User } from '../types';
import { Timer } from './Timer';
import { BsKanbanFill, BsListCheck } from 'react-icons/bs';
import { TodosSideNav } from './TodosSideNav';
import { BoardWithId, mapBoardsFromFirebase } from '../utils/util-functions';
import { useEffect, useState } from 'react';
import Router from 'next/router';
import { BoardsSideNav } from './BoardsSideNav';

interface Props {
  user: User | null;
}

export const NavBar: React.FC<Props> = (props) => {
  const { user } = props;
  const router = useRouter();
  const AuthUser = useAuthUser();
  // const { isOpen: isKeyMapOpen, onOpen: onKeymapOpen, onClose: onKeymapClose } = useDisclosure();
  const {
    isOpen: isTodosOpen,
    onOpen: onTodosOpen,
    onClose: onTodosClose,
  } = useDisclosure();
  const {
    isOpen: isBoardsOpen,
    onOpen: onBoardsOpen,
    onClose: onBoardsClose,
  } = useDisclosure();
  const [boards, setBoards] = useState<BoardWithId[]>([]);
  useEffect(() => {
    if (user && user.boards) setBoards(mapBoardsFromFirebase(user.boards));
  }, [user]);

  return (
    <Flex
      direction="row"
      color="white"
      bgGradient="linear(to-r, cyan.700,purple.500)"
      p={4}
      align="center"
      justify="space-between"
    >
      <HStack spacing={2}>
        {AuthUser.email ? (
          <>
            <Tooltip label="Go to dashboard" aria-label="Go to dashboard">
              <IconButton
                variant="ghost"
                size="lg"
                color="current"
                fontSize="3xl"
                icon={<MdDashboard />}
                aria-label={`Go to dashboard`}
                onClick={() => router.push(config.routes.dashboard)}
              />
            </Tooltip>
            {user !== null && boards.length > 0 ? (

            <Tooltip label="Your boards" aria-label="boards">
              <IconButton
                variant="ghost"
                size="lg"
                color="current"
                fontSize="3xl"
                icon={<BsKanbanFill />}
                aria-label={'boards'}
                onClick={onBoardsOpen}
              />
            </Tooltip>
            ) : null}
            <Tooltip label="Your todos" aria-label="todos">
              <IconButton
                variant="ghost"
                size="lg"
                color="current"
                fontSize="3xl"
                icon={<BsListCheck />}
                aria-label={'todos'}
                onClick={onTodosOpen}
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
            onClick={() => router.push('/')}
            aria-label={`Home`}
          />
        )}
      </HStack>
      <HStack spacing={4}>
        {user !== null ? <Timer user={user} /> : null}
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        {AuthUser.email ? (
          <>
            {/* <Tooltip label="Profile" aria-label="user profile">
              <Avatar
                name="user"
                src={AuthUser.photoURL as string}
                size="md"
                cursor="pointer"
                onClick={() => router.push(config.routes.user)}
              />
            </Tooltip> */}
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
      {/* <KeymapModal modalOpen={isKeyMapOpen} modalClose={onKeymapClose} /> */}
      <BoardsSideNav
        onClose={onBoardsClose}
        boards={boards}
        isOpen={isBoardsOpen}
      />
      <TodosSideNav isOpen={isTodosOpen} onClose={onTodosClose} />
    </Flex>
  );
};

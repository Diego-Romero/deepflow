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
import { BoardsSideNav } from './BoardsSideNav';
import { HamburgerIcon } from '@chakra-ui/icons';

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
            <Tooltip label="Your todos" aria-label="todos">
              <IconButton
                variant="ghost"
                size="lg"
                color="current"
                fontSize="3xl"
                icon={<BsListCheck />}
                aria-label={'todos'}
                onClick={onTodosOpen}
                mr={4}
              />
            </Tooltip>
            {/* <Tooltip label="Go to dashboard" aria-label="Go to dashboard">
              <IconButton
                variant="ghost"
                size="lg"
                color="current"
                fontSize="3xl"
                icon={<MdDashboard />}
                aria-label={`Go to dashboard`}
                onClick={() => router.push(config.routes.dashboard)}
              />
            </Tooltip> */}
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
      {user !== null ? <Timer user={user} /> : null}
      <HStack spacing={2}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="ghost"
            fontSize="3xl"
          />
          <MenuList color="gray.900" fontSize="lg">
            <MenuItem
              icon={<IoMdHome />}
              onClick={() => router.push(config.routes.dashboard)}
            >
              Dashboard
            </MenuItem>
            <MenuItem icon={<BsKanbanFill />} onClick={onBoardsOpen}>
              Boards
            </MenuItem>
            <MenuItem icon={<IoMdLogOut />} onClick={AuthUser.signOut}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
        {/* {user !== null && boards.length > 0 ? (
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
        ) : null} */}
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
            {/* <Tooltip label="Logout" aria-label="Logout">
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
            </Tooltip> */}
          </>
        ) : null}
      </HStack>
      {/* <KeymapModal modalOpen={isKeyMapOpen} modalClose={onKeymapClose} /> */}
      {AuthUser.email ? (
        <>
          <BoardsSideNav
            onClose={onBoardsClose}
            boards={boards}
            isOpen={isBoardsOpen}
          />
          <TodosSideNav isOpen={isTodosOpen} onClose={onTodosClose} />
        </>
      ) : null}
    </Flex>
  );
};

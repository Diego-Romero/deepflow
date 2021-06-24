import {
  Divider,
  Flex,
  IconButton,
  Stack,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import config from '../utils/config';
import { User } from '../types';
import { BsKanban, BsListCheck } from 'react-icons/bs';
import { TodosSideNav } from './TodosSideNav';
import { BoardWithId, mapBoardsFromFirebase } from '../utils/util-functions';
import { useEffect, useState } from 'react';
import { BoardsSideNav } from './BoardsSideNav';
import { BsGraphUp } from 'react-icons/bs';
import { FaRegKeyboard } from 'react-icons/fa';
import { KeymapModal } from './KeymapModal';

interface Props {
  user: User;
}

export const SideNav: React.FC<Props> = (props) => {
  const { user } = props;
  const router = useRouter();
  const AuthUser = useAuthUser();
  const {
    isOpen: isKeyMapOpen,
    onOpen: onKeymapOpen,
    onClose: onKeymapClose,
  } = useDisclosure();
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
      direction="column"
      align="center"
      justify="space-between"
      bgColor="white"
      shadow="md"
    >
      <Stack spacing={2} p={4}>
        <Tooltip label="Dashboard" aria-label="dashboard">
          <IconButton
            size="lg"
            variant="ghost"
            colorScheme="gray"
            fontSize="2xl"
            icon={<BsGraphUp />}
            aria-label={'dashboard'}
            onClick={() => router.push(config.routes.dashboard)}
          />
        </Tooltip>
        <Divider borderColor="gray.500" />
        <Tooltip label="Boards" aria-label="boards">
          <IconButton
            variant="ghost"
            colorScheme="gray"
            size="lg"
            fontSize="2xl"
            icon={<BsKanban />}
            aria-label={'boards'}
            onClick={onBoardsOpen}
          />
        </Tooltip>
        <Divider borderColor="gray.500" />
        <Tooltip label="Your todos" aria-label="todos">
          <IconButton
            variant="ghost"
            colorScheme="gray"
            size="lg"
            fontSize="2xl"
            icon={<BsListCheck />}
            aria-label={'todos'}
            onClick={onTodosOpen}
          />
        </Tooltip>
        <Divider borderColor="gray.500" />
      </Stack>
      <Stack>
        <Divider borderColor="gray.500" />
        <Tooltip label="Keyboard shortcuts" aria-label="Keyboard shortcuts">
          <IconButton
            size="lg"
            variant="ghost"
            colorScheme="blue"
            fontSize="3xl"
            onClick={onKeymapOpen}
            icon={<FaRegKeyboard />}
            aria-label={`Keyboard shortcuts`}
          />
        </Tooltip>
      </Stack>
      {AuthUser.email ? (
        <>
          <BoardsSideNav
            onClose={onBoardsClose}
            boards={boards}
            isOpen={isBoardsOpen}
          />
          <TodosSideNav isOpen={isTodosOpen} onClose={onTodosClose} />
          <KeymapModal modalOpen={isKeyMapOpen} modalClose={onKeymapClose} />
        </>
      ) : null}
    </Flex>
  );
};
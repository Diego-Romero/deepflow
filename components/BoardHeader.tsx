import { EditIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Board } from '../types';
import { BoardSettingsModal } from './BoardSettingsModal';

interface Props {
  board: Board;
  updateBoard: (boardUpdatedData: Board) => void;
  deleteBoard: () => void;
}

export const BoardHeader: React.FC<Props> = ({
  board,
  updateBoard,
  deleteBoard,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>
      <Flex
        alignItems="center"
        mb={4}
        flexDir={'row'}
        justifyContent="flex-start"
        width="100%"
      >
        <HStack spacing={8}>
          <Tooltip label="Edit" aria-label="edit">
            <IconButton
              size="sm"
              // colorScheme="blue"
              backgroundColor="white"
              variant="outline"
              shadow="md"
              isRound
              onClick={onOpen}
              icon={<SettingsIcon />}
              aria-label={'Edit'}
            />
          </Tooltip>
          <Heading noOfLines={1} isTruncated size="lg">
            {board.name}
          </Heading>
        </HStack>
      </Flex>
      <BoardSettingsModal
        modalClose={onClose}
        updateBoard={updateBoard}
        deleteBoard={deleteBoard}
        modalOpen={isOpen}
        board={board}
      />
    </Box>
  );
};

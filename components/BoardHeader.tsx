import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { Board } from "../types";
import { BoardSettingsModal } from "./BoardSettingsModal";

interface Props {
  board: Board;
  updateBoard: (boardUpdatedData: Board) => void;
  deleteBoard: () => void;
}

export const BoardHeader: React.FC<Props> = ({
  board,
  updateBoard,
  deleteBoard
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box>

    <Flex
      alignItems="center"
      mb={4}
      flexDir={"row"}
      justifyContent="flex-start"
      width="100%"
    >
          <HStack spacing={1}>
      <Text fontSize="4xl" fontWeight="bold" noOfLines={1} isTruncated mb={0}>
        {board.name}
      </Text>
            <Tooltip label="Edit" aria-label="edit">
              <IconButton
                size="sm"
                variant="outline"
                isRound
                onClick={onOpen}
                icon={<EditIcon />}
                aria-label={"Edit"}
              />
            </Tooltip>
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

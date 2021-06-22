import {
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { Board, BoardData } from "../types";

interface Props {
  openSettings: () => void;
  board: Board;
  firebaseUpdateBoard: (nextBoard: BoardData) => void;
}


export const BoardHeader: React.FC<Props> = ({
  board,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <Flex
      alignItems="center"
      mb={4}
      flexDir={"row"}
      justifyContent="flex-start"
      width="100%"
    >
      <Text fontSize="4xl" fontWeight="bold" noOfLines={1} isTruncated mb={0}>
        {board.name}
      </Text>

    </Flex>
  );
};

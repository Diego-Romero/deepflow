import { AddIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Flex,
  Text,
  IconButton,
  Tooltip,
  VStack,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { IoMdPlay } from "react-icons/io";
import { BoardType } from "../types";
import { BsStopFill, BsPauseFill } from "react-icons/bs";

interface Props {
  openSettings: () => void;
  board: BoardType;
}

export const BoardHeader: React.FC<Props> = ({ openSettings, board }) => {
  return (
    <Flex
      alignItems="center"
      mb={4}
      flexDir={"row"}
      justifyContent="space-between"
      width="100%"
    >
      <Text fontSize="3xl" fontWeight="bold" noOfLines={1} isTruncated mb={0}>
        {board.name}
      </Text>
      <Flex flexDir="row" alignItems="center">
        <Flex
          borderWidth="1px"
          bgColor="gray.100"
          shadow="md"
          borderRadius="md"
          p="4"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="xl" fontWeight="bold" mr={4}>
            {board.workInterval}:00
          </Text>
          <HStack>
            <Tooltip label="Start timer">
              <IconButton
                isRound
                aria-label="play"
                icon={<IoMdPlay />}
                size="md"
                colorScheme="blue"
                // onClick={openSettings}
                shadow="md"
              />
            </Tooltip>
            {/* <Tooltip label="Stop timer">
              <IconButton
                isRound
                aria-label="stop"
                icon={<BsStopFill />}
                size="md"
                colorScheme="orange"
                // onClick={openSettings}
                shadow="lg"
              />
            </Tooltip>
            <Tooltip label="Pause timer">
              <IconButton
                isRound
                color="white"
                aria-label="pause"
                icon={<BsPauseFill />}
                size="md"
                colorScheme="yellow"
                // onClick={openSettings}
                shadow="lg"
              />
            </Tooltip> */}
          </HStack>
          <Text fontSize="xl" fontWeight="bold" ml={4}>
            0 / {board.targetPerDay}
          </Text>
        </Flex>
        <ButtonGroup spacing={[2]} variant="outline" size={"lg"} ml={4}>
          <Tooltip label="Open settings">
            <IconButton
              isRound
              aria-label="update"
              icon={<SettingsIcon />}
              colorScheme="purple"
              onClick={openSettings}
              shadow="md"
            />
          </Tooltip>
          {/* <Tooltip label="Add Row">
          <IconButton
            isRound
            onClick={openNewColumnModal}
            variant="outline"
            aria-label="Add row"
            colorScheme="purple"
            icon={<AddIcon />}
          />
        </Tooltip> */}
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};

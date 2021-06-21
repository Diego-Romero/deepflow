import {
  Modal,
  ModalBody,
  Text,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Heading,
  Stack,
  Button,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { BsStopFill } from "react-icons/bs";
import { BoardType } from "../types";

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  stopTimer: () => void;
  startTimer: () => void;
  board: BoardType;
  remainingTime: string;
}

export const TimerModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  remainingTime,
  board,
  stopTimer,
  startTimer,
}) => {
  const isOnBreak = () => board.onLongBreak || board.onShortBreak;
  function formatText(): string {
    if (isOnBreak()) {
      return board.isTimerPlaying ? "On break" : "Time for a break";
    }
    return "Time to work";
  }
  function formatTextColor(): string {
    const green = "green.500";
    const orange = "orange.600";
    if (board.isTimerPlaying) {
      if (isOnBreak()) return green;
      return orange;
    }
    if (isOnBreak()) return "green.500";
    return "gray.600";
  }

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex textAlign="center" p={8} flexDir="column">
            <Heading color={formatTextColor()}>{formatText()}</Heading>
            <Heading mt={4} size="3xl" color={formatTextColor()}>
              {remainingTime}
            </Heading>
            <Text color="gray.500" mt={4} fontSize="lg">
              {board.pomodoroCount} / {board.targetPerDay}
            </Text>
            <Stack spacing={4} align="center" mt={4}>
              {board.isTimerPlaying ? (
                <Button isFullWidth onClick={stopTimer}>
                  Stop
                </Button>
              ) : (
                <Button variant="outline" isFullWidth onClick={startTimer}>
                  Start
                </Button>
              )}
              {/* <Button variant="outline" isFullWidth onClick={modalClose}>
                Close
              </Button> */}
            </Stack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

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
} from '@chakra-ui/react';
import React from 'react';
import { User } from '../../../types';

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  stopTimer: () => void;
  startTimer: () => void;
  user: User;
  remainingTime: string;
}

export const TimerModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  remainingTime,
  user,
  stopTimer,
  startTimer,
}) => {
  const isOnBreak = () => user.onLongBreak || user.onShortBreak;
  function formatText(): string {
    if (isOnBreak()) {
      return user.isTimerPlaying ? 'On break' : 'Time for a break';
    }
    return 'Time to work';
  }
  function formatTextColor(): string {
    const green = 'green.500';
    const orange = 'orange.600';
    if (user.isTimerPlaying) {
      if (isOnBreak()) return green;
      return orange;
    }
    if (isOnBreak()) return 'green.500';
    return 'gray.600';
  }

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody>
          <Flex textAlign="center" p={8} flexDir="column">
            <Heading size="lg" color={formatTextColor()}>
              {formatText()}
            </Heading>
            <Heading mt={4} size="2xl" color={formatTextColor()}>
              {remainingTime}
            </Heading>
            <Text color="gray.500" mt={4} fontSize="lg">
              {user.pomodoroCount} / {user.targetPerDay}
            </Text>
            <Stack spacing={4} align="center" mt={4}>
              {user.isTimerPlaying ? (
                <Button size="sm" isFullWidth onClick={stopTimer}>
                  Stop
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  isFullWidth
                  onClick={startTimer}
                >
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

import { RepeatIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Flex,
  Text,
  IconButton,
  Tooltip,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BsStopFill } from "react-icons/bs";
import React, { useEffect } from "react";
import useSound from "use-sound";
import { IoMdPlay } from "react-icons/io";
import { BsArrowsAngleExpand } from "react-icons/bs";
import { Board, BoardData } from "../types";
import { formatWatchTime } from "../utils/util-functions";
import { TimerModal } from "./TimerModal";
import workTimerDoneSound from "../public/sounds/work-timer-done.mp3";
import restTimerDoneSound from "../public/sounds/rest-timer-done.mp3";

interface Props {
  openSettings: () => void;
  board: Board;
  boardData: BoardData;
  firebaseUpdateBoard: (nextBoard: BoardData) => void;
}

const TIMER_DEFAULT_TIME = 0;

export const BoardHeader: React.FC<Props> = ({
  openSettings,
  boardData,
  board,
  firebaseUpdateBoard,
}) => {
  const [remainingTime, setRemainingTime] = React.useState<string>(``);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [playWorkTimerDone] = useSound(workTimerDoneSound);
  const [playRestTimerDone] = useSound(restTimerDoneSound);

  useEffect(() => {
    if (boardData.isTimerPlaying) onOpen();
  }, []);

  useEffect(() => {
    if (!boardData.isTimerPlaying && boardData.timerEndTime !== TIMER_DEFAULT_TIME) {
      if (boardData.onShortBreak || boardData.onLongBreak) {
        // if is on break just set the breaks to false
        firebaseUpdateBoard({
          ...boardData,
          onShortBreak: false,
          onLongBreak: false,
          timerEndTime: TIMER_DEFAULT_TIME,
        });
      } else {
        // increase the counter and set the appropriate break
        const nextPomodoroCounter = boardData.pomodoroCount + 1;
        if (nextPomodoroCounter % boardData.longBreakAfter === 0) {
          firebaseUpdateBoard({
            ...boardData,
            pomodoroCount: nextPomodoroCounter,
            onLongBreak: true,
            isTimerPlaying: false,
            timerEndTime: TIMER_DEFAULT_TIME,
          });
        } else {
          firebaseUpdateBoard({
            ...boardData,
            pomodoroCount: nextPomodoroCounter,
            onShortBreak: true,
            isTimerPlaying: false,
            timerEndTime: TIMER_DEFAULT_TIME,
          });
        }
      }
    }
  }, [boardData]);

  const setIsTimerPlaying = (isTimerPlaying: boolean) => {
    firebaseUpdateBoard({ ...boardData, isTimerPlaying });
  };

  const resetTimer = () =>
    firebaseUpdateBoard({
      ...boardData,
      pomodoroCount: 0,
      timerEndTime: TIMER_DEFAULT_TIME,
      onShortBreak: false,
      onLongBreak: false,
      isTimerPlaying: false,
    });

  const startNextTimer = () => {
    const now = new Date();
    let countdownDate = new Date();
    if (boardData.onLongBreak) {
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + boardData.longRestTime * 60 * 1000);
    } else if (boardData.onShortBreak)
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + boardData.shortRestTime * 60 * 1000);
    else {
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + boardData.workInterval * 60 * 1000);
    }
    // calculates the next valid timer and starts the board
    firebaseUpdateBoard({
      ...boardData,
      timerEndTime: countdownDate.getTime(),
      isTimerPlaying: true,
    });
    onOpen();
  };

  const stopTimer = () => {
    firebaseUpdateBoard({
      ...boardData,
      isTimerPlaying: false,
      timerEndTime: TIMER_DEFAULT_TIME,
      onShortBreak: false,
      onLongBreak: false,
    });
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = boardData.timerEndTime - now.getTime();
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (minutes === 0 && seconds === 0) {
      if (boardData.onShortBreak || boardData.onLongBreak) playRestTimerDone();
      else playWorkTimerDone();
      setIsTimerPlaying(false);
    }

    const formattedTime = `${formatWatchTime(minutes)}:${formatWatchTime(
      seconds
    )}`;

    setRemainingTime(formattedTime);
  };

  const displayNextTimer = () => {
    if (boardData.onLongBreak) return `${boardData.longRestTime}:00`;
    else if (boardData.onShortBreak) return `${boardData.shortRestTime}:00`;
    else return `${boardData.workInterval}:00`;
  };

  /**
   * Component that renders the countdown when it renders, it should just receive the end time
   */
  const TimerRunning: React.FC = () => {
    useEffect(() => {
      calculateTimeLeft();

      const timer = setTimeout(() => {
        calculateTimeLeft();
      }, 1000);
      return () => clearTimeout(timer);
    });

    return <span>{remainingTime}</span>;
  };

  return (
    <Flex
      alignItems="center"
      mb={4}
      flexDir={"row"}
      justifyContent="space-between"
      width="100%"
    >
      <Text fontSize="4xl" fontWeight="bold" noOfLines={1} isTruncated mb={0}>
        {board.name}
      </Text>
      <Flex flexDir="row" alignItems="center">
        {/* <audio src={workTimerDoneSound} controls></audio>
        <button onClick={playWorkTimerDone}>play sound</button> */}
        <Flex
          borderWidth="1px"
          bgColor="gray.100"
          shadow="md"
          borderRadius="md"
          p="4"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mr={4}
            color={
              boardData.onShortBreak || boardData.onLongBreak
                ? "green"
                : boardData.isTimerPlaying
                ? "orange.500"
                : "inherit"
            }
          >
            {boardData.isTimerPlaying ? (
              <Flex flexDir="row" alignItems="center" justifyContent="center">
                <TimerRunning />
              </Flex>
            ) : (
              <span>{displayNextTimer()}</span>
            )}
          </Text>
          <HStack>
            {boardData.isTimerPlaying ? (
              <Tooltip label="Stop timer">
                <IconButton
                  isRound
                  aria-label="stop"
                  icon={<BsStopFill />}
                  size="md"
                  colorScheme={
                    boardData.onShortBreak || boardData.onLongBreak ? "green" : "orange"
                  }
                  onClick={stopTimer}
                  shadow="lg"
                />
              </Tooltip>
            ) : (
              <Tooltip label="Start timer">
                <IconButton
                  isRound
                  aria-label="play"
                  icon={<IoMdPlay />}
                  size="md"
                  onClick={startNextTimer}
                  colorScheme={
                    boardData.onShortBreak || boardData.onLongBreak ? "green" : "blue"
                  }
                  shadow="md"
                />
              </Tooltip>
            )}
          </HStack>
          <Text fontSize="2xl" fontWeight="bold" ml={4}>
            {boardData.pomodoroCount} / {boardData.targetPerDay}
          </Text>

          <Tooltip label="Full screen timer">
            <IconButton
              isRound
              aria-label="full screen timer"
              icon={<BsArrowsAngleExpand />}
              // color="black"
              colorScheme="blue"
              variant="outline"
              size="md"
              onClick={onOpen}
              ml={4}
              shadow="lg"
            />
          </Tooltip>
          <Tooltip label="Reset timer">
            <IconButton
              isRound
              aria-label="reset"
              icon={<RepeatIcon />}
              size="md"
              variant="outline"
              ml={2}
              colorScheme="blue"
              onClick={resetTimer}
              shadow="lg"
            />
          </Tooltip>
          <Tooltip label="Open settings">
            <IconButton
              isRound
              size="md"
              variant="outline"
              ml={2}
              aria-label="update"
              icon={<SettingsIcon />}
              colorScheme="blue"
              onClick={openSettings}
              shadow="lg"
            />
          </Tooltip>
        </Flex>
      </Flex>
      <TimerModal
        modalOpen={isOpen}
        modalClose={onClose}
        boardData={boardData}
        remainingTime={
          boardData.isTimerPlaying ? remainingTime : displayNextTimer()
        }
        stopTimer={stopTimer}
        startTimer={startNextTimer}
      />
    </Flex>
  );
};

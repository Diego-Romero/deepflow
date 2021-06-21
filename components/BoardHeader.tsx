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
import { BoardType } from "../types";
import { formatWatchTime } from "../utils/util-functions";
import { TimerModal } from "./TimerModal";
import workTimerDoneSound from "../public/sounds/work-timer-done.mp3";
import restTimerDoneSound from "../public/sounds/rest-timer-done.mp3";

interface Props {
  openSettings: () => void;
  board: BoardType;
  firebaseUpdateBoard: (nextBoard: BoardType) => void;
}

const TIMER_DEFAULT_TIME = 0;

export const BoardHeader: React.FC<Props> = ({
  openSettings,
  board,
  firebaseUpdateBoard,
}) => {
  const [remainingTime, setRemainingTime] = React.useState<string>(``);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [playWorkTimerDone] = useSound(workTimerDoneSound);
  const [playRestTimerDone] = useSound(restTimerDoneSound);

  useEffect(() => {
    if (board.isTimerPlaying) onOpen();
  }, []);

  useEffect(() => {
    if (!board.isTimerPlaying && board.timerEndTime !== TIMER_DEFAULT_TIME) {
      if (board.onShortBreak || board.onLongBreak) {
        // if is on break just set the breaks to false
        firebaseUpdateBoard({
          ...board,
          onShortBreak: false,
          onLongBreak: false,
          timerEndTime: TIMER_DEFAULT_TIME,
        });
      } else {
        // increase the counter and set the appropriate break
        const nextPomodoroCounter = board.pomodoroCount + 1;
        if (nextPomodoroCounter % board.longBreakAfter === 0) {
          firebaseUpdateBoard({
            ...board,
            pomodoroCount: nextPomodoroCounter,
            onLongBreak: true,
            isTimerPlaying: false,
            timerEndTime: TIMER_DEFAULT_TIME,
          });
        } else {
          firebaseUpdateBoard({
            ...board,
            pomodoroCount: nextPomodoroCounter,
            onShortBreak: true,
            isTimerPlaying: false,
            timerEndTime: TIMER_DEFAULT_TIME,
          });
        }
      }
    }
  }, [board]);

  const setIsTimerPlaying = (isTimerPlaying: boolean) => {
    firebaseUpdateBoard({ ...board, isTimerPlaying });
  };

  const resetTimer = () =>
    firebaseUpdateBoard({
      ...board,
      pomodoroCount: 0,
      timerEndTime: TIMER_DEFAULT_TIME,
      onShortBreak: false,
      onLongBreak: false,
      isTimerPlaying: false,
    });

  const startNextTimer = () => {
    const now = new Date();
    let countdownDate = new Date();
    if (board.onLongBreak) {
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      // countdownDate.setTime(now.getTime() + board.longRestTime * 60 * 1000);
    } else if (board.onShortBreak)
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + board.shortRestTime * 60 * 1000);
    else {
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + board.workInterval * 60 * 1000);
    }
    // calculates the next valid timer and starts the board
    firebaseUpdateBoard({
      ...board,
      timerEndTime: countdownDate.getTime(),
      isTimerPlaying: true,
    });
    onOpen();
  };

  const stopTimer = () => {
    firebaseUpdateBoard({
      ...board,
      isTimerPlaying: false,
      timerEndTime: TIMER_DEFAULT_TIME,
      onShortBreak: false,
      onLongBreak: false,
    });
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = board.timerEndTime - now.getTime();
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (minutes === 0 && seconds === 0) {
      if (board.onShortBreak || board.onLongBreak) playRestTimerDone();
      else playWorkTimerDone();
      setIsTimerPlaying(false);
    }

    const formattedTime = `${formatWatchTime(minutes)}:${formatWatchTime(
      seconds
    )}`;

    setRemainingTime(formattedTime);
  };

  const displayNextTimer = () => {
    if (board.onLongBreak) return `${board.longRestTime}:00`;
    else if (board.onShortBreak) return `${board.shortRestTime}:00`;
    else return `${board.workInterval}:00`;
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
      <Text fontSize="3xl" fontWeight="bold" noOfLines={1} isTruncated mb={0}>
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
            fontSize="xl"
            fontWeight="bold"
            mr={4}
            color={
              board.onShortBreak || board.onLongBreak
                ? "green"
                : board.isTimerPlaying
                ? "orange.500"
                : "inherit"
            }
          >
            {board.isTimerPlaying ? (
              <Flex flexDir="row" alignItems="center" justifyContent="center">
                <TimerRunning />
              </Flex>
            ) : (
              <span>{displayNextTimer()}</span>
            )}
          </Text>
          <HStack>
            {board.isTimerPlaying ? (
              <Tooltip label="Stop timer">
                <IconButton
                  isRound
                  aria-label="stop"
                  icon={<BsStopFill />}
                  size="md"
                  colorScheme={
                    board.onShortBreak || board.onLongBreak ? "green" : "orange"
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
                    board.onShortBreak || board.onLongBreak ? "green" : "blue"
                  }
                  shadow="md"
                />
              </Tooltip>
            )}
          </HStack>
          <Text fontSize="xl" fontWeight="bold" ml={4}>
            {board.pomodoroCount} / {board.targetPerDay}
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
              ml={2}
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
        </ButtonGroup>
      </Flex>
      <TimerModal
        modalOpen={isOpen}
        modalClose={onClose}
        board={board}
        remainingTime={
          board.isTimerPlaying ? remainingTime : displayNextTimer()
        }
        stopTimer={stopTimer}
        startTimer={startNextTimer}
      />
    </Flex>
  );
};

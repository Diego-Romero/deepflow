import { SettingsIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  Flex,
  Text,
  IconButton,
  Tooltip,
  HStack,
} from "@chakra-ui/react";
import { BsStopFill } from "react-icons/bs";
import React, { useEffect, useState } from "react";
import { IoMdPlay } from "react-icons/io";
import { BoardType } from "../types";
import { formatWatchTime } from "../utils/util-functions";

interface Props {
  openSettings: () => void;
  board: BoardType;
}

export const BoardHeader: React.FC<Props> = ({ openSettings, board }) => {
  const [timerEndTime, setTimerEndTime] = useState<null | Date>(null);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [shortBreak, setShortBreak] = useState(false);
  const [longBreak, setLongBreak] = useState(false);

  useEffect(() => {
    if (pomodoroCount !== 0) {
      if (pomodoroCount % board.longBreakAfter === 0) setLongBreak(true);
      else setShortBreak(true);
    }
  }, [pomodoroCount]);

  const startTimer = () => {
    const now = new Date();
    let countdownDate = new Date();
    if (longBreak) {
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + board.longRestTime * 60 * 1000);
    } else if (shortBreak)
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + board.shortRestTime * 60 * 1000);
    else {
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + board.workInterval * 60 * 1000);
    }
    setTimerEndTime(countdownDate);
  };

  /**
   * Component that renders the countdown when it renders, it should just receive the end time
   */
  const TimerRunning: React.FC<{ endTime: Date }> = ({ endTime }) => {
    const [remainingTime, setRemainingTime] = React.useState<string>(``);
    useEffect(() => {
      calculateTimeLeft();
      const timer = setTimeout(() => {
        calculateTimeLeft();
      }, 1000);
      return () => clearTimeout(timer);
    });

    /**
     * calculates the time remaining from now until the end time of the next timer.
     * When the current timer reaches 0, it increases the pomodoro count by one if is not a rest,
     * it also resets the breaks to false.
     */
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      if (minutes === 0 && seconds === 0) {
        setTimerEndTime(null);
        if (!shortBreak && !longBreak) setPomodoroCount(pomodoroCount + 1);
        setShortBreak(false);
        // setLongBreak(false);
        return;
      }
      const formattedTime = `${formatWatchTime(minutes)}:${formatWatchTime(
        seconds
      )}`;
      setRemainingTime(formattedTime);
    };
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
              shortBreak || longBreak
                ? "green"
                : timerEndTime !== null
                ? "orange.500"
                : "inherit"
            }
          >
            {timerEndTime === null ? (
              `00:00`
            ) : (
              <TimerRunning endTime={timerEndTime} />
            )}
          </Text>
          <HStack>
            {timerEndTime === null ? (
              <Tooltip label="Start timer">
                <IconButton
                  isRound
                  aria-label="play"
                  icon={<IoMdPlay />}
                  size="md"
                  onClick={() => {
                    // setShortBreak(false);
                    // setsho
                    startTimer();
                  }}
                  colorScheme={shortBreak || longBreak ? "green" : "blue"}
                  shadow="md"
                />
              </Tooltip>
            ) : (
              <Tooltip label="Stop timer">
                <IconButton
                  isRound
                  aria-label="stop"
                  icon={<BsStopFill />}
                  size="md"
                  colorScheme={shortBreak || longBreak ? "green" : "orange"}
                  onClick={() => {
                    setShortBreak(false);
                    setLongBreak(false);
                    setTimerEndTime(null);
                  }}
                  shadow="lg"
                />
              </Tooltip>
            )}
            {/* <Tooltip label="Pause timer">
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
            {pomodoroCount} / {board.targetPerDay}
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

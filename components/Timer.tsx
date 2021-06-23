import { RepeatClockIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Flex,
  Text,
  IconButton,
  Tooltip,
  HStack,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { BsStopFill } from 'react-icons/bs';
import React, { useEffect } from 'react';
import useSound from 'use-sound';
import { IoMdPlay } from 'react-icons/io';
import { BsArrowsAngleExpand } from 'react-icons/bs';
import { User } from '../types';
import { formatWatchTime } from '../utils/util-functions';
import { TimerModal } from './TimerModal';
import workTimerDoneSound from '../public/sounds/work-timer-done.mp3';
import restTimerDoneSound from '../public/sounds/rest-timer-done.mp3';
import Firebase from 'firebase';
import config from '../utils/config';
import { useAuthUser } from 'next-firebase-auth';
import { TimerSettingsModal } from './TimerSettingsModal';

interface Props {
  user: User;
}

const TIMER_DEFAULT_TIME = 0;

export const Timer: React.FC<Props> = ({ user }) => {
  const [remainingTime, setRemainingTime] = React.useState<string>(``);
  const {
    isOpen: isFullScreenTimerOpen,
    onOpen: onFullScreenTimerOpen,
    onClose: onFullScreenTimerClose,
  } = useDisclosure();
  const {
    isOpen: isTimerSettingsOpen,
    onOpen: onTimerSettingsOpen,
    onClose: onTimerSettingsClose,
  } = useDisclosure();
  const [playWorkTimerDone] = useSound(workTimerDoneSound);
  const [playRestTimerDone] = useSound(restTimerDoneSound);
  const authUser = useAuthUser();

  const UserRef = Firebase.database().ref(
    config.collections.user(authUser.id as string)
  );

  function firebaseUpdateBoard(userUpdated: User) {
    UserRef.set(userUpdated);
  }

  useEffect(() => {
    if (!user.isTimerPlaying && user.timerEndTime !== TIMER_DEFAULT_TIME) {
      if (user.onShortBreak || user.onLongBreak) {
        // if is on break just set the breaks to false
        firebaseUpdateBoard({
          ...user,
          onShortBreak: false,
          onLongBreak: false,
          timerEndTime: TIMER_DEFAULT_TIME,
        });
      } else {
        // increase the counter and set the appropriate break
        const nextPomodoroCounter = user.pomodoroCount + 1;
        if (nextPomodoroCounter % user.longBreakAfter === 0) {
          firebaseUpdateBoard({
            ...user,
            pomodoroCount: nextPomodoroCounter,
            onLongBreak: true,
            isTimerPlaying: false,
            timerEndTime: TIMER_DEFAULT_TIME,
          });
        } else {
          firebaseUpdateBoard({
            ...user,
            pomodoroCount: nextPomodoroCounter,
            onShortBreak: true,
            isTimerPlaying: false,
            timerEndTime: TIMER_DEFAULT_TIME,
          });
        }
      }
    }
  }, [user]);

  const setIsTimerPlaying = (isTimerPlaying: boolean) => {
    firebaseUpdateBoard({ ...user, isTimerPlaying });
  };

  const resetTimer = () =>
    firebaseUpdateBoard({
      ...user,
      pomodoroCount: 0,
      timerEndTime: TIMER_DEFAULT_TIME,
      onShortBreak: false,
      onLongBreak: false,
      isTimerPlaying: false,
    });

  const startNextTimer = () => {
    const now = new Date();
    let countdownDate = new Date();
    if (user.onLongBreak) {
      // countdownDate.setTime(now.getTime() + 0.2 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + user.longRestTime * 60 * 1000);
    } else if (user.onShortBreak)
      // countdownDate.setTime(now.getTime() + 0.2 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + user.shortRestTime * 60 * 1000);
    else {
      // countdownDate.setTime(now.getTime() + 0.5 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + user.workInterval * 60 * 1000);
    }
    // calculates the next valid timer and starts the board
    firebaseUpdateBoard({
      ...user,
      timerEndTime: countdownDate.getTime(),
      isTimerPlaying: true,
    });
    onFullScreenTimerOpen();
  };

  const stopTimer = () => {
    firebaseUpdateBoard({
      ...user,
      isTimerPlaying: false,
      timerEndTime: TIMER_DEFAULT_TIME,
      onShortBreak: false,
      onLongBreak: false,
    });
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = user.timerEndTime - now.getTime();
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (minutes <= 0 && seconds <= 0) {
      if (user.onShortBreak || user.onLongBreak) playRestTimerDone();
      else playWorkTimerDone();
      setIsTimerPlaying(false);
    }

    const formattedTime = `${formatWatchTime(minutes)}:${formatWatchTime(
      seconds
    )}`;

    setRemainingTime(formattedTime);
  };

  const displayNextTimer = () => {
    if (user.onLongBreak) return `${user.longRestTime}:00`;
    else if (user.onShortBreak) return `${user.shortRestTime}:00`;
    else return `${user.workInterval}:00`;
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
    <Flex flexDir="row" alignItems="center" display={["none", "flex"]}>
      <Flex
        borderWidth="1px"
        bgColor="white"
        shadow="md"
        color="black"
        borderRadius="lg"
        p="4"
        alignItems="center"
        justifyContent="center"
      >
        <Flex flexDir="row" alignItems="center" justifyContent="center">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            mr={3}
            color={
              user.onShortBreak || user.onLongBreak
                ? 'green'
                : user.isTimerPlaying
                ? 'orange.500'
                : 'inherit'
            }
          >
            {user.isTimerPlaying ? (
              <TimerRunning />
            ) : (
              <span>{displayNextTimer()}</span>
            )}
          </Text>
        </Flex>
        <HStack>
          {user.isTimerPlaying ? (
            <Tooltip label="Stop timer">
              <IconButton
                isRound
                aria-label="stop"
                icon={<BsStopFill />}
                size="md"
                colorScheme={
                  user.onShortBreak || user.onLongBreak ? 'green' : 'orange'
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
                  user.onShortBreak || user.onLongBreak ? 'green' : 'blue'
                }
                shadow="md"
              />
            </Tooltip>
          )}
        </HStack>
        <Box ml={3} pl={3} pr={3} mr={3} borderLeftWidth={1} borderRightWidth={1} borderColor="gray.500">
          <Text fontSize="2xl" fontWeight="bold">
            {user.pomodoroCount} / {user.targetPerDay}
          </Text>
        </Box>

        <Tooltip label="Full screen timer">
          <IconButton
            isRound
            aria-label="full screen timer"
            icon={<BsArrowsAngleExpand />}
            // color="black"
            colorScheme="blue"
            variant="outline"
            size="md"
            onClick={onFullScreenTimerOpen}
            shadow="lg"
          />
        </Tooltip>
        <Tooltip label="Open settings">
          <IconButton
            isRound
            size="md"
            variant="outline"
            ml={2}
            disabled={user.isTimerPlaying}
            aria-label="update"
            icon={<SettingsIcon />}
            colorScheme="blue"
            onClick={onTimerSettingsOpen}
            shadow="lg"
          />
        </Tooltip>
        <Tooltip label="Reset timer">
          <IconButton
            isRound
            aria-label="reset"
            icon={<RepeatClockIcon />}
            size="md"
            variant="outline"
            ml={2}
            disabled={user.isTimerPlaying}
            colorScheme="blue"
            onClick={resetTimer}
            shadow="lg"
          />
        </Tooltip>
      </Flex>
      <TimerSettingsModal
        user={user}
        modalClose={onTimerSettingsClose}
        updateUser={firebaseUpdateBoard}
        modalOpen={isTimerSettingsOpen}
      />
      <TimerModal
        modalOpen={isFullScreenTimerOpen}
        modalClose={onFullScreenTimerClose}
        user={user}
        remainingTime={user.isTimerPlaying ? remainingTime : displayNextTimer()}
        stopTimer={stopTimer}
        startTimer={startNextTimer}
      />
    </Flex>
  );
};

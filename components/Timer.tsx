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
import { User, WorkedTime } from '../types';
import { formatWatchTime } from '../utils/util-functions';
import { TimerModal } from './TimerModal';
import workTimerDoneSound from '../public/sounds/work-timer-done.mp3';
import restTimerDoneSound from '../public/sounds/rest-timer-done.mp3';
import Firebase from 'firebase';
import config from '../utils/config';
import { useAuthUser } from 'next-firebase-auth';
import { TimerSettingsModal } from './TimerSettingsModal';
import moment from 'moment';

interface Props {
  user: User;
}

const TIMER_DEFAULT_TIME = 0;

const resetUserTimerFields = {
  pomodoroCount: 0,
  timerEndTime: TIMER_DEFAULT_TIME,
  onShortBreak: false,
  onLongBreak: false,
  isTimerPlaying: false,
};

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

  const userRef = Firebase.database().ref(
    config.collections.user(authUser.id as string)
  );

  function firebaseUpdateUser(userUpdated: User) {
    userRef.set(userUpdated);
  }

  function formatSingleDigit(n: number): string {
    return n.toString().length === 1 ? `0${n}` : n.toString();
  }

  async function recordPreviousWorkedTime(
    count: number,
    worked: number,
    isoString: string
  ) {
    const userId = authUser.id as string;
    const dateWorkedTimeRef = Firebase.database().ref(
      config.collections.userWorkTimeYesterday(userId, isoString)
    );

    const record = await dateWorkedTimeRef.get();
    const val = record.val() as WorkedTime | null;
    if (val) {
      dateWorkedTimeRef.set({
        count: count + val.count,
        worked: worked + val.worked,
      });
    } else {
      dateWorkedTimeRef.set({
        count,
        worked,
      });
    }
  }

  function getTodayIsoString() {
    const today = moment().toObject();
    return `${today.years}-${formatSingleDigit(
      today.months + 1
    )}-${formatSingleDigit(today.date)}`;
  }

  useEffect(() => {
    // When we render the timer, we calculate if there was any pomodoros done in the previous session
    // if they were, we store it in the user records and reset the current timer.
    const todayIsoString = getTodayIsoString();
    if (!user.workingDayIsoString) {
      userRef.set({ ...user, workingDayIsoString: todayIsoString });
    } else {
      if (user.workingDayIsoString !== todayIsoString) {
        // if we moved ahead in date, we reset timer and record the work done
        resetTimer(user.workingDayIsoString);
      }
    }
  }, []);

  useEffect(() => {
    if (!user.isTimerPlaying && user.timerEndTime !== TIMER_DEFAULT_TIME) {
      if (user.onShortBreak || user.onLongBreak) {
        // if is on break just set the breaks to false
        firebaseUpdateUser({
          ...user,
          onShortBreak: false,
          onLongBreak: false,
          timerEndTime: TIMER_DEFAULT_TIME,
        });
      } else {
        // increase the counter and set the appropriate break
        const nextPomodoroCounter = user.pomodoroCount + 1;
        if (nextPomodoroCounter % user.longBreakAfter === 0) {
          firebaseUpdateUser({
            ...user,
            pomodoroCount: nextPomodoroCounter,
            onLongBreak: true,
            isTimerPlaying: false,
            timerEndTime: TIMER_DEFAULT_TIME,
          });
        } else {
          firebaseUpdateUser({
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
    firebaseUpdateUser({ ...user, isTimerPlaying });
  };

  // resets the timer, records the previously stored working time on the provided ISO string
  const resetTimer = (isoString: string) => {
    recordPreviousWorkedTime(
      user.pomodoroCount,
      user.workInterval * user.pomodoroCount,
      isoString
    );
    firebaseUpdateUser({
      ...user,
      pomodoroCount: 0,
      timerEndTime: TIMER_DEFAULT_TIME,
      onShortBreak: false,
      onLongBreak: false,
      isTimerPlaying: false,
      workingDayIsoString: getTodayIsoString(),
    });
  };

  const startNextTimer = () => {
    const now = new Date();
    let countdownDate = new Date();
    if (user.onLongBreak) {
      // countdownDate.setTime(now.getTime() + 0.2 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + user.longRestTime * 60 * 1000);
    } else if (user.onShortBreak)
      // countdownDate.setTime(now.getTime() + 0.2 * 60 * 1000);
      // to be used when testing
      countdownDate.setTime(now.getTime() + user.shortRestTime * 60 * 1000);
    else {
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + user.workInterval * 60 * 1000);
    }
    // calculates the next valid timer and starts the board
    firebaseUpdateUser({
      ...user,
      timerEndTime: countdownDate.getTime(),
      isTimerPlaying: true,
    });
    onFullScreenTimerOpen();
  };

  const stopTimer = () => {
    firebaseUpdateUser({
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
    <Flex flexDir="row" alignItems="center" display={['none', 'flex']}>
      <Flex
        borderWidth="1px"
        bgColor="white"
        shadow="md"
        color="black"
        borderRadius="lg"
        px={4}
        py={3}
        alignItems="center"
        justifyContent="center"
      >
        <Flex flexDir="row" alignItems="center" justifyContent="center">
          <Text
            fontSize="xl"
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
            <Tooltip label="Stop">
              <IconButton
                isRound
                aria-label="stop"
                icon={<BsStopFill />}
                size="sm"
                colorScheme={
                  user.onShortBreak || user.onLongBreak ? 'green' : 'orange'
                }
                onClick={stopTimer}
                shadow="lg"
              />
            </Tooltip>
          ) : (
            <Tooltip label="Start">
              <IconButton
                isRound
                aria-label="play"
                icon={<IoMdPlay />}
                size="sm"
                onClick={startNextTimer}
                colorScheme={
                  user.onShortBreak || user.onLongBreak ? 'green' : 'purple'
                }
                shadow="md"
              />
            </Tooltip>
          )}
        </HStack>
        <Box
          ml={3}
          pl={3}
          pr={3}
          mr={3}
          borderLeftWidth={1}
          borderRightWidth={1}
          borderColor="gray.500"
        >
          <Text fontSize="xl" fontWeight="bold">
            {user.pomodoroCount} / {user.targetPerDay}
          </Text>
        </Box>

        <Tooltip label="Fullscreen">
          <IconButton
            isRound
            aria-label="full screen timer"
            icon={<BsArrowsAngleExpand />}
            // color="black"
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={onFullScreenTimerOpen}
            shadow="md"
          />
        </Tooltip>
        <Tooltip label="Settings">
          <IconButton
            isRound
            size="sm"
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
        <Tooltip label="Reset">
          <IconButton
            isRound
            aria-label="reset"
            icon={<RepeatClockIcon />}
            size="sm"
            variant="outline"
            ml={2}
            disabled={user.isTimerPlaying}
            colorScheme="blue"
            onClick={() => resetTimer(getTodayIsoString())}
            shadow="lg"
          />
        </Tooltip>
      </Flex>
      <TimerSettingsModal
        user={user}
        modalClose={onTimerSettingsClose}
        updateUser={firebaseUpdateUser}
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

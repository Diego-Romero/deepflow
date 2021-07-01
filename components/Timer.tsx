import { RepeatClockIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Flex,
  Text,
  IconButton,
  Tooltip,
  HStack,
  useDisclosure,
  Box,
  useToast,
} from '@chakra-ui/react';
import { BsStopFill } from 'react-icons/bs';
import React, { useEffect } from 'react';
import useSound from 'use-sound';
import { IoMdPlay } from 'react-icons/io';
import { BsArrowsAngleExpand } from 'react-icons/bs';
import { User, WorkedTime } from '../types';
import { formatWatchTime, getTodayIsoString } from '../utils/util-functions';
import { TimerModal } from './TimerModal';
import workTimerDoneSound from '../public/sounds/work-timer-done.mp3';
import restTimerDoneSound from '../public/sounds/rest-timer-done.mp3';
import Firebase from 'firebase';
import config from '../utils/config';
import { useAuthUser } from 'next-firebase-auth';
import { TimerSettingsModal } from './TimerSettingsModal';
import { PomodoroNotesForm } from './PomodoroNotesForm';

interface Props {
  user: User;
}

const TIMER_DEFAULT_TIME = 0;
const POMODORO_NOTE_TIMER_MS = 30000;

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
  const toast = useToast();

  const userRef = Firebase.database().ref(
    config.collections.user(authUser.id as string)
  );

  const todayWorkedTimeRef = Firebase.database().ref(
    config.collections.userWorkTimeYesterday(
      authUser.id as string,
      getTodayIsoString()
    )
  );

  function firebaseUpdateUser(userUpdated: User) {
    userRef.set(userUpdated);
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
      const valCount = val.count || 0;
      const valWorked = val.worked || 0;
      dateWorkedTimeRef.update({
        count: count + valCount,
        worked: worked + valWorked,
      });
    } else {
      dateWorkedTimeRef.set({
        count,
        worked,
      });
    }
  }

  const setIsTimerPlaying = (isTimerPlaying: boolean) => {
    firebaseUpdateUser({ ...user, isTimerPlaying });
  };

  // rough estimation of the worked time, adds the work intervals * the pomodoroCount, also includes the short rests but not the long ones
  function calculateWorkedTime(): number {
    // add the rested time to the pomodoros as well
    let sum = user.workInterval * user.pomodoroCount; // the time worked
    sum += user.pomodoroCount * user.shortRestTime;
    return sum;
  }

  // resets the timer, records the previously stored working time on the provided ISO string
  const resetTimer = (isoString: string) => {
    recordPreviousWorkedTime(
      user.pomodoroCount,
      calculateWorkedTime(),
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
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000); // to be used when testing
      countdownDate.setTime(now.getTime() + user.longRestTime * 60 * 1000);
    } else if (user.onShortBreak)
      // countdownDate.setTime(now.getTime() + 0.1 * 60 * 1000);
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

  function playSound() {
    if (user.onShortBreak || user.onLongBreak) playRestTimerDone();
    else playWorkTimerDone();
  }

  const isUserOnBreak = user.onShortBreak || user.onLongBreak;

  function closeToast() {
    toast.closeAll();
  }

  async function saveNote(note: string) {
    const todayValue = await todayWorkedTimeRef.get();
    const val = todayValue.val() as WorkedTime | null;
    if (!val) {
      const todayVal: WorkedTime = { count: 0, worked: 0, notes: [note] };
      todayWorkedTimeRef.set(todayVal);
    } else {
      const notes = val.notes || [];
      const todayVal: WorkedTime = { ...val, notes: [...notes, note] };
      todayWorkedTimeRef.set(todayVal);
    }
    closeToast();
  }

  function showToast() {
    if (!isUserOnBreak) {
      toast({
        render: () => (
          <PomodoroNotesForm close={() => closeToast()} saveNote={saveNote} />
        ),
        duration: POMODORO_NOTE_TIMER_MS,
        isClosable: true,
        variant: 'top-accent',
        position: 'bottom-right',
      });
    }
  }

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = user.timerEndTime - now.getTime();
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (minutes <= 0 && seconds <= 0) {
      playSound();
      closeToast();
      showToast();
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
    <Flex flexDir="row" alignItems="center">
      <Flex
        borderWidth="1px"
        bgColor="white"
        shadow="md"
        color="black"
        borderRadius="lg"
        px={2}
        py={2}
        alignItems="center"
        justifyContent="center"
      >
        <Flex flexDir="row" alignItems="center" justifyContent="center">
          <Text
            fontSize="lg"
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
                bgGradient={
                  user.onShortBreak || user.onLongBreak
                    ? 'linear(to-r, teal.400, green.400)'
                    : 'linear(to-r, cyan.700,purple.500)'
                }
                _hover={{
                  bgGradient:
                    user.onLongBreak || user.onLongBreak
                      ? 'linear(to-r, teal.300, green.300)'
                      : 'linear(to-r, cyan.300,purple.300)',
                }}
                color="white"
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
          <Text fontSize="lg" fontWeight="bold">
            {user.pomodoroCount} / {user.targetPerDay}
          </Text>
        </Box>

        <Tooltip label="Fullscreen">
          <IconButton
            isRound
            aria-label="full screen timer"
            icon={<BsArrowsAngleExpand />}
            variant="outline"
            size="sm"
            onClick={onFullScreenTimerOpen}
            shadow="md"
            color="gray.900"
            borderColor="gray.900"
            colorScheme="gray"
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
            onClick={onTimerSettingsOpen}
            shadow="lg"
            color="gray.900"
            borderColor="gray.900"
            colorScheme="gray"
          />
        </Tooltip>
        {/* <Tooltip label="Reset">
          <IconButton
            isRound
            aria-label="reset"
            icon={<RepeatClockIcon />}
            size="sm"
            variant="outline"
            ml={2}
            disabled={user.isTimerPlaying}
            onClick={() => resetTimer(getTodayIsoString())}
            shadow="lg"
            color="gray.900"
            borderColor="gray.900"
            colorScheme="gray"
          />
        </Tooltip> */}
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

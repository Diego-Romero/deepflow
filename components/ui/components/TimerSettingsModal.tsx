import {
  Text,
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';
import { NumberInputControl } from 'formik-chakra-ui';
import React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { User } from '../../../types';

export interface UserTimerSettingsValues {
  workInterval: number;
  shortRestTime: number;
  longRestTime: number;
  longBreakAfter: number;
  targetPerDay: number;
}

const validationSchema = Yup.object().shape({
  workInterval: Yup.number().required(),
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  updateUser: (updatedUser: User) => void;
  user: User;
}

export const TimerSettingsModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  updateUser,
  user,
}) => {
  const initialValues: UserTimerSettingsValues = {
    workInterval: user.workInterval || 25,
    shortRestTime: user.shortRestTime || 5,
    longRestTime: user.longRestTime || 30,
    longBreakAfter: user.longBreakAfter || 4,
    targetPerDay: user.targetPerDay || 10,
    // targetPerWeek: board.targetPerWeek || 50,
  };

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pomodoro settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              updateUser({ ...user, ...values });
              modalClose();
            }}
            validationSchema={validationSchema}
          >
            {(_props) => (
              <Form>
                <Stack spacing={5}>
                  {user.isTimerPlaying ? (
                    <Text color="gray.600">
                      Only allowed to update when timer is not playing.
                    </Text>
                  ) : null}
                  <Grid
                    gridColumnGap={[null, null, 8]}
                    gridRowGap={4}
                    gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
                  >
                    <NumberInputControl
                      name="workInterval"
                      helperText="How long are your pomodoros"
                      isRequired
                      label="Work interval"
                      isDisabled={user.isTimerPlaying}
                      numberInputProps={{
                        min: 10,
                        max: 120,
                        step: 5,
                        clampValueOnBlur: true,
                        inputMode: 'numeric',
                        precision: 0,
                        size: 'sm',
                      }}
                    />

                    <NumberInputControl
                      name="shortRestTime"
                      isRequired
                      helperText="Resting time between pomodoros"
                      label="Short rest time"
                      isDisabled={user.isTimerPlaying}
                      numberInputProps={{
                        min: 1,
                        max: 60,
                        step: 5,
                        clampValueOnBlur: true,
                        inputMode: 'numeric',
                        precision: 0,
                        size: 'sm',
                      }}
                    />
                    <NumberInputControl
                      name="longBreakAfter"
                      isRequired
                      label="Long break after"
                      isDisabled={user.isTimerPlaying}
                      helperText="Take a long break after this amount of pomodoros"
                      numberInputProps={{
                        min: 2,
                        max: 10,
                        step: 1,
                        clampValueOnBlur: true,
                        inputMode: 'numeric',
                        precision: 0,
                        size: 'sm',
                      }}
                    />
                    <NumberInputControl
                      name="longRestTime"
                      isRequired
                      label="Long rest time"
                      isDisabled={user.isTimerPlaying}
                      helperText="Amount of rest time after a block of pomodoros"
                      numberInputProps={{
                        min: 10,
                        max: 120,
                        step: 5,
                        clampValueOnBlur: true,
                        inputMode: 'numeric',
                        precision: 0,
                        size: 'sm',
                      }}
                    />
                    <NumberInputControl
                      name="targetPerDay"
                      isRequired
                      label="Target per day"
                      isDisabled={user.isTimerPlaying}
                      helperText="How many pomodoros do you aim to do in a day"
                      numberInputProps={{
                        min: 6,
                        max: 20,
                        step: 1,
                        clampValueOnBlur: true,
                        inputMode: 'numeric',
                        precision: 0,
                        size: 'sm',
                      }}
                    />
                  </Grid>
                </Stack>
                <Button
                  my={8}
                  isFullWidth
                  type="submit"
                  variant="solid"
                  size="sm"
                  colorScheme="blackAlpha"
                  _hover={{
                    bgColor: 'gray.700',
                  }}
                  bgColor="gray.900"
                  color="white"
                >
                  Update
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

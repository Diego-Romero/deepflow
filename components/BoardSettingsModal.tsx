import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormHelperText,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { InputControl, NumberInputControl } from "formik-chakra-ui";
import React, { RefObject } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { validation } from "../utils/util-functions";
import { BoardType } from "../types";

export interface BoardSettingsValues {
  name: string;
  workInterval: number;
  shortRestTime: number;
  longRestTime: number;
  longBreakAfter: number;
  targetPerDay: number;
  // targetPerWeek: number;
}

const validationSchema = Yup.object().shape({
  name: validation.name,
  workInterval: Yup.number().required(),
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  updateBoard: (boardUpdatedData: BoardSettingsValues) => void;
  deleteBoard: () => void;
  board: BoardType;
}

export const BoardSettingsModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  updateBoard,
  deleteBoard,
  board,
}) => {
  const alertDialogCancelRef = React.useRef();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();

  const initialValues: BoardSettingsValues = {
    name: board.name,
    workInterval: board.workInterval || 25,
    shortRestTime: board.shortRestTime || 5,
    longRestTime: board.longRestTime || 30,
    longBreakAfter: board.longBreakAfter || 4,
    targetPerDay: board.targetPerDay || 10,
    // targetPerWeek: board.targetPerWeek || 50,
  };

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Board Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              updateBoard(values);
              modalClose();
            }}
            validationSchema={validationSchema}
          >
            {(_props) => (
              <Form>
                <Stack spacing={5}>
                  <InputControl name="name" label="Name" isRequired />
                  <Grid
                    gridColumnGap={[null, null, 4]}
                    gridRowGap={5}
                    gridTemplateColumns={["1fr", "1fr", "repeat(2, 1fr)"]}
                  >
                    <NumberInputControl
                      name="workInterval"
                      helperText="How long are your pomodoros"
                      isRequired
                      label="Work interval"
                      numberInputProps={{
                        min: 10,
                        max: 120,
                        step: 5,
                        clampValueOnBlur: true,
                        inputMode: "numeric",
                        precision: 0,
                      }}
                    />

                    <NumberInputControl
                      name="shortRestTime"
                      isRequired
                      helperText="Resting time between pomodoros"
                      label="Short rest time"
                      numberInputProps={{
                        min: 1,
                        max: 60,
                        step: 5,
                        clampValueOnBlur: true,
                        inputMode: "numeric",
                        precision: 0,
                      }}
                    />
                    <NumberInputControl
                      name="longBreakAfter"
                      isRequired
                      label="Long break after"
                      helperText="Take a long break after this amount of pomodoros"
                      numberInputProps={{
                        min: 2,
                        max: 10,
                        step: 1,
                        clampValueOnBlur: true,
                        inputMode: "numeric",
                        precision: 0,
                      }}
                    />
                    <NumberInputControl
                      name="longRestTime"
                      isRequired
                      label="Long rest time"
                      helperText="Amount of rest time after a block of pomodoros"
                      numberInputProps={{
                        min: 10,
                        max: 120,
                        step: 5,
                        clampValueOnBlur: true,
                        inputMode: "numeric",
                        precision: 0,
                      }}
                    />
                    <NumberInputControl
                      name="targetPerDay"
                      isRequired
                      label="Target per day"
                      helperText="How many pomodoros do you aim to do in a day"
                      numberInputProps={{
                        min: 6,
                        max: 20,
                        step: 1,
                        clampValueOnBlur: true,
                        inputMode: "numeric",
                        precision: 0,
                      }}
                    />
                  </Grid>
                </Stack>
                <Button
                  mt={8}
                  isFullWidth
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                >
                  Update
                </Button>
                <Button
                  mt={4}
                  mb={4}
                  colorScheme="red"
                  variant="outline"
                  isFullWidth
                  onClick={onDeleteAlertOpen}
                >
                  Delete board
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={alertDialogCancelRef as RefObject<any>}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete board
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can not undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={alertDialogCancelRef as any}
                onClick={onDeleteAlertClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  deleteBoard();
                  onDeleteAlertClose();
                  modalClose();
                }}
                ml={3}
              >
                Delete board
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};

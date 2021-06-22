import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Text,
  Button,
  Divider,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { InputControl } from "formik-chakra-ui";
import React, { RefObject } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Board } from "../types";
import { validation } from "../utils/util-functions";

export interface BoardSettingsValues {
  name: string;
}

const validationSchema = Yup.object().shape({
  name: validation.name 
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  updateBoard: (boardUpdatedData: Board) => void;
  deleteBoard: () => void;
  board: Board;
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
  };

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Board Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              const nextBoard: Board = {...board, ...values}
              console.log(nextBoard)
              updateBoard(nextBoard);
              modalClose();
            }}
            validationSchema={validationSchema}
          >
            {(_props) => (
              <Form>
                <Stack spacing={5}>
                  <InputControl name="name" label="Name" isRequired />
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
                <Divider mt={4} />
                <Heading mt={4} size="md">
                  Danger Zone
                </Heading>
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

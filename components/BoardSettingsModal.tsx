import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import React, { RefObject } from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { toastConfig } from "../utils/toastConfig";
import { validation } from "../utils/util-functions";

export interface ContactFormValues {
  name: string;
}

const initialValues: ContactFormValues = {
  name: "",
};

const validationSchema = Yup.object().shape({
  name: validation.name,
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  updateBoard: (name: string) => void;
  deleteBoard: () => void;
}

export const BoardSettingsModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  updateBoard,
  deleteBoard,
}) => {
  const [isLargerThan480] = useMediaQuery("(min-width: 480px)");
  const alertDialogCancelRef = React.useRef();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Board</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              updateBoard(values.name);
              modalClose();
            }}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form>
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl
                      id="name"
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <FormLabel htmlFor="name">Name</FormLabel>
                      <Input
                        {...field}
                        type="text"
                        autoFocus={isLargerThan480}
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  mt={8}
                  isFullWidth
                  type="submit"
                  variant="solid"
                  colorScheme="purple"
                  isLoading={props.isSubmitting}
                >
                  Update
                </Button>
                <Button
                  mt={4}
                  mb={4}
                  colorScheme="red"
                  variant="solid"
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
              <Button ref={alertDialogCancelRef as any} onClick={onDeleteAlertClose}>
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

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
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { RefObject } from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { validation } from '../../../utils/util-functions';
import { DeleteIcon } from '@chakra-ui/icons';

export interface ContactFormValues {
  name: string;
}

const validationSchema = Yup.object().shape({
  name: validation.name,
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  updateColumn: (name: string, index: number) => void;
  deleteColumn: (index: number) => void;
  index: number;
  name: string;
}

export const ColumnSettingsModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  updateColumn,
  deleteColumn,
  index,
  name,
}) => {
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');
  const alertDialogCancelRef = React.useRef();
  const {
    isOpen: isDeleteAlertOpen,
    onOpen: onDeleteAlertOpen,
    onClose: onDeleteAlertClose,
  } = useDisclosure();

  const initialValues: ContactFormValues = {
    name,
  };

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Column</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              updateColumn(values.name, index);
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
                      <FormLabel size="sm" htmlFor="name">
                        Name
                      </FormLabel>
                      <Input
                        {...field}
                        type="text"
                        size="sm"
                        autoFocus={isLargerThan480}
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  isFullWidth
                  type="submit"
                  variant="solid"
                  // colorScheme="blue"
                  _hover={{ bgColor: 'gray.700' }}
                  bgColor="gray.900"
                  color="white"
                  size="sm"
                  isLoading={props.isSubmitting}
                >
                  Update
                </Button>
                <IconButton
                  variant="outline"
                  isFullWidth
                  mt={4}
                  mb={4}
                  size="sm"
                  colorScheme="red"
                  onClick={onDeleteAlertOpen}
                  icon={<DeleteIcon />}
                  aria-label={'Delete'}
                />
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
              Delete column
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
                  deleteColumn(index);
                  onDeleteAlertClose();
                  modalClose();
                }}
                ml={3}
              >
                Delete column
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};

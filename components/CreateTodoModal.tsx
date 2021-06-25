import {
  Flex,
  FormControl,
  FormErrorMessage,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { validation } from '../utils/util-functions';
import { AddIcon } from '@chakra-ui/icons';

export interface CreateTodoValues {
  name: string;
}

const initialValues: CreateTodoValues = {
  name: '',
};

const validationSchema = Yup.object().shape({
  name: validation.name,
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
	createTodo: (name: string) => void;
}

export const CreateTodoModal: React.FC<Props> = ({ modalOpen, modalClose }) => {
  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              // createNewItem(columnIndex, values.name);
              actions.resetForm();
              actions.setSubmitting(false);
              modalClose();
            }}
            validationSchema={validationSchema}
          >
            {(_props) => (
              <Form>
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl
                      id="name"
                      isRequired
                      isInvalid={form.errors.name && form.touched.name}
                    >
                      <Flex
                        flexDir="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Input
                          {...field}
                          type="text"
                          variant="flushed"
                          autoFocus
                          placeholder="New item name..."
                          size="md"
                          focusBorderColor="none"
                        />
                        <IconButton
                          variant="solid"
                          colorScheme="gray"
                          backgroundColor="white"
                          borderColor="gray.900"
                          color="gray.900"
                          size="sm"
                          isRound
                          mb={2}
                          type="submit"
                          aria-label="Create todo"
                          icon={<AddIcon />}
                        />
                      </Flex>
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

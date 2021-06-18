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
} from "@chakra-ui/react";
import React from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { validation } from "../utils/util-functions";
import { AddIcon } from "@chakra-ui/icons";

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
  createColumn: (name: string) => void;
}

export const CreateColumnModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  createColumn,
}) => {
  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              actions.resetForm();
              actions.setSubmitting(false);
              modalClose();
              createColumn(values.name);
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
                          placeholder="New column name"
                          size="lg"
                          focusBorderColor="none"
                        />
                        <IconButton
                          variant="solid"
                          colorScheme="blue"
                          size="md"
                          isRound
                          mb={2}
                          type="submit"
                          aria-label="Create column"
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

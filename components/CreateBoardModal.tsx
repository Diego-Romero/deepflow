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
  createBoard: (name: string) => void;
}

export const CreateBoardModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  createBoard: createColumn,
}) => {
  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="xl">
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
                          placeholder="New Board Name"
                          size="lg"
                          focusBorderColor="none"
                        />
                        <AddIcon w={4} h={4} ml={4} />
                      </Flex>
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <IconButton
                  variant="solid"
                  colorScheme="teal"
                  size="sm"
                  display="none"
                  isRound
                  mb={2}
                  type="submit"
                  aria-label="Create Board"
                  icon={<AddIcon />}
                />
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

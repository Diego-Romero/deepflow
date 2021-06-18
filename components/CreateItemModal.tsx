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
  createNewItem: (listIndex: number, name: string) => void;
  columnIndex: number;
}

export const CreateItemModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  createNewItem,
  columnIndex,
}) => {
  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              createNewItem(columnIndex, values.name);
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
                          aria-label="Create item"
                          icon={<AddIcon />}
                        />
                      </Flex>
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                {/* <IconButton
                  variant="solid"
                  colorScheme="teal"
                  size="sm"
                  display="none"
                  isRound
                  mb={2}
                  type="submit"
                  aria-label="Create item"
                  icon={<AddIcon />}
                /> */}
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

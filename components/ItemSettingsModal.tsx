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
} from "@chakra-ui/react";
import React, { RefObject } from "react";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { validation } from "../utils/util-functions";
import { ColumnItemType } from "../types";
import { DeleteIcon } from "@chakra-ui/icons";

export interface ContactFormValues {
  name: string;
}

const validationSchema = Yup.object().shape({
  name: validation.name,
});

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  itemIndex: number;
  colIndex: number;
  updateItem: (
    columnIndex: number,
    itemIndex: number,
    item: ColumnItemType
  ) => void;
  deleteItem: (columnIndex: number, itemIndex: number) => void;
  item: ColumnItemType;
}

export const ItemSettingsModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  updateItem,
  deleteItem,
  itemIndex,
  colIndex,
  item,
}) => {
  const [isLargerThan480] = useMediaQuery("(min-width: 480px)");

  const initialValues: ContactFormValues = {
    name: item.name,
  };

  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              actions.setSubmitting(false);
              updateItem(colIndex, itemIndex, values);
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
                <IconButton
                  variant="outline"
                  isFullWidth
                  mt={4}
                  mb={4}
                  colorScheme="red"
                  size="md"
                  onClick={() => {
                    deleteItem(colIndex, itemIndex);
                    modalClose();
                  }}
                  icon={<DeleteIcon />}
                  aria-label={"Delete"}
                />
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

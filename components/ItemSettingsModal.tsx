import {
  Button,
  Text,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useMediaQuery,
} from '@chakra-ui/react';
import React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import {
  longDateFormat,
  shortDateFormat,
  validation,
} from '../utils/util-functions';
import { ColumnItem } from '../types';
import { DeleteIcon } from '@chakra-ui/icons';
import { InputControl, SwitchControl, TextareaControl } from 'formik-chakra-ui';

export interface ItemSettingsValues {
  name: string;
  description: string;
  done: boolean;
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
    item: ColumnItem
  ) => void;
  deleteItem: (columnIndex: number, itemIndex: number) => void;
  item: ColumnItem;
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
  const [isLargerThan480] = useMediaQuery('(min-width: 480px)');

  const initialValues: ItemSettingsValues = {
    name: item.name,
    description: item.description || '',
    done: item.done || false,
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
              updateItem(colIndex, itemIndex, { ...item, ...values });
              modalClose();
            }}
            validationSchema={validationSchema}
          >
            {(props) => (
              <Form>
                <Stack spacing={4}>
                  <InputControl name="name" label="Name" isRequired />
                  <TextareaControl
                    name="description"
                    label="Description"
                    textareaProps={{ rows: 6 }}
                  />
                  <SwitchControl name="done" label="Done" />
                  <Text color="gray.500">
                    Created: {shortDateFormat(item.createdAt)}
                  </Text>
                </Stack>
                <Button
                  mt={8}
                  isFullWidth
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
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
                  aria-label={'Delete'}
                />
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

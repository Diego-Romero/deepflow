import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { InputControl, RadioGroupControl } from 'formik-chakra-ui';
import React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { validation } from '../utils/util-functions';

export interface BoardSettingsValues {
  name: string;
  template: TemplateTypes;
}

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
  createBoard: (name: string, template: TemplateTypes) => void;
}

export enum TemplateTypes {
  todoDoingDone = 'todoDoingDone',
  weekdays = 'weekdays',
  blank = 'blank',
}

export const CreateBoardModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
  createBoard,
}) => {
  const initialValues: BoardSettingsValues = {
    name: '',
    template: TemplateTypes.todoDoingDone,
  };
  const validationSchema = Yup.object().shape({
    name: validation.name,
  });
  return (
    <Modal isOpen={modalOpen} onClose={modalClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create board</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              actions.resetForm();
              actions.setSubmitting(false);
              modalClose();
              createBoard(values.name, values.template);
            }}
            validationSchema={validationSchema}
          >
            {(_props) => (
              <Form>
                <Stack spacing={4}>
                  <InputControl name="name" label="Name" isRequired />
                  <RadioGroupControl
                    name="template"
                    label="Template"
                    helperText="We recommend starting with a template to help you get going"
                  >
                    <Radio size="lg" value={TemplateTypes.todoDoingDone}>
                      Default
                    </Radio>
                    <Radio size="lg" value={TemplateTypes.weekdays}>
                      Weekdays
                    </Radio>
                    <Radio size="lg" value={TemplateTypes.blank}>
                      Blank
                    </Radio>
                  </RadioGroupControl>
                </Stack>
                <Button
                  mt={6}
                  mb={4}
                  isFullWidth
                  type="submit"
                  variant="solid"
                  bgGradient="linear(to-r, cyan.700,purple.500)"
                  _hover={{
                    bgGradient: 'linear(to-r, cyan.600,purple.400)',
                  }}
                  color="white"
                >
                  Create
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

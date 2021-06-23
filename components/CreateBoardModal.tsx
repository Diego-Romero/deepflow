import {
  Button,
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
import { createTemplateColumns, validation } from '../utils/util-functions';
import Firebase from 'firebase';
import config from '../utils/config';
import { Board } from '../types';
import { useAuthUser } from 'next-firebase-auth';

export interface BoardSettingsValues {
  name: string;
  template: TemplateTypes;
}

interface Props {
  modalOpen: boolean;
  modalClose: () => void;
}

export enum TemplateTypes {
  todoDoingDone = 'todoDoingDone',
  weekdays = 'weekdays',
  blank = 'blank',
}

export const CreateBoardModal: React.FC<Props> = ({
  modalOpen,
  modalClose,
}) => {
  const authUser = useAuthUser();

  const initialValues: BoardSettingsValues = {
    name: '',
    template: TemplateTypes.todoDoingDone,
  };
  const validationSchema = Yup.object().shape({
    name: validation.name,
  });

  const userBoardsRef = Firebase.database().ref(
    config.collections.userBoards(authUser.id as string)
  );

  const createBoard = (name: string, template: TemplateTypes) => {
    const newBoard: Board = {
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      colSize: 3,
    };
    const boardData = {
      columns: createTemplateColumns(template),
    };
    const key = userBoardsRef.push(newBoard).key;
    const BoardDataRef = Firebase.database().ref(
      config.collections.boardData(key as string)
    );
    BoardDataRef.set(boardData);
  };

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

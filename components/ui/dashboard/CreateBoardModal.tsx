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
import {
  createTemplateColumns,
  validation,
} from '../../../utils/util-functions';
import Firebase from 'firebase';
import config from '../../../utils/config';
import { Board } from '../../../types';
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
    <Modal isOpen={modalOpen} onClose={modalClose} size="sm">
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
                  <InputControl
                    size="sm"
                    name="name"
                    label="Name"
                    isRequired
                    inputProps={{ size: 'sm' }}
                  />
                  <RadioGroupControl size="sm" name="template" label="Template">
                    <Stack spacing={2}>
                      <Radio size="md" value={TemplateTypes.todoDoingDone}>
                        Default
                      </Radio>
                      <Radio size="md" value={TemplateTypes.weekdays}>
                        Weekdays
                      </Radio>
                      {/* <Radio size="md" value={TemplateTypes.blank}>
                        Blank
                      </Radio> */}
                    </Stack>
                  </RadioGroupControl>
                </Stack>
                <Button
                  mt={6}
                  mb={4}
                  size="sm"
                  isFullWidth
                  type="submit"
                  colorScheme="blackAlpha"
                  _hover={{
                    bgColor: 'gray.700',
                  }}
                  bgColor="gray.900"
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

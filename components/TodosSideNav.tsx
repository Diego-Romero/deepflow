import { AddIcon } from '@chakra-ui/icons';
import Firebase from 'firebase';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Stack,
  IconButton,
  DrawerFooter,
  Button,
} from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { TodoItem } from '../types';
import * as Yup from 'yup';
import { validation } from '../utils/util-functions';
import { InputControl } from 'formik-chakra-ui';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useAuthUser } from 'next-firebase-auth';
import config from '../utils/config';
import produce from 'immer';
import { TodoItemComponent } from './TodoItem';

const reorder = (
  list: TodoItem[],
  startIndex: number,
  endIndex: number
): TodoItem[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TodosSideNav: React.FC<Props> = (props) => {
  const { isOpen, onClose } = props;

  const authUser = useAuthUser();
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const todosRef = Firebase.database().ref(
    config.collections.userTodos(authUser.id as string)
  );

  const getTodos = () => {
    todosRef.on('value', (snapshot) => {
      setTodos(snapshot.val() || []);
    });
  };

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = (item: TodoItem) => {
    todosRef.set([item, ...todos]);
  };

  const updateTodo = (item: TodoItem, index: number) => {
    const next = produce(todos, (draft) => {
      draft[index] = item;
    });
    todosRef.set(next);
  };

  const deleteTodo = (index: number) => {
    const next = [...todos];
    next.splice(index, 1);
    todosRef.set(next);
  };

  const onDragEnd = (result) => {
    if (result.destination) {
      // if dropped inside the list
      const items: TodoItem[] = reorder(
        todos,
        result.source.index,
        result.destination.index
      );
      setTodos(items);
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Todos</DrawerHeader>

        <DrawerBody>
          <Formik
            initialValues={{ name: '' }}
            onSubmit={(values, actions) => {
              const item: TodoItem = {
                ...values,
                createdAt: Date.now(),
                done: false,
              };
              addTodo(item);
              actions.resetForm();
            }}
            validationSchema={Yup.object().shape({ name: validation.name })}
          >
            {(_props) => (
              <Form>
                <Stack spacing={3}>
                  <InputControl
                    name="name"
                    inputProps={{ variant: 'flushed', autoFocus: true }}
                  />
                  <IconButton
                    shadow="lg"
                    width="auto"
                    mt={1}
                    mb={2}
                    size="sm"
                    variant="outline"
                    type="submit"
                    bgColor="gray.900"
                    _hover={{ bgColor: 'gray.700' }}
                    color="white"
                    icon={<AddIcon />}
                    aria-label={'create new item'}
                  />
                </Stack>
              </Form>
            )}
          </Formik>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="todos">
              {(provided, snapshot) => (
                <Flex
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  flexDir="column"
                  justifyContent="center"
                  alignItems="center"
                  // bgColor={snapshot.isDraggingOver ? 'gray.100' : 'inherit'}
                  // borderWidth={snapshot.isDraggingOver ? 1 : 'inherit'}
                  borderRadius="md"
                  my={4}
                >
                  {todos.map((item, index) => (
                    <TodoItemComponent
                      index={index}
                      item={item}
                      key={index}
                      updateTodo={updateTodo}
                      deleteTodo={deleteTodo}
                    />
                  ))}
                  {provided.placeholder}
                </Flex>
              )}
            </Droppable>
          </DragDropContext>
        </DrawerBody>

        <DrawerFooter>
          <Button size="sm" variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  DragHandleIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import {
  Heading,
  Text,
  Flex,
  Box,
  IconButton,
  Stack,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import { InputControl } from 'formik-chakra-ui';
import { useAuthUser } from 'next-firebase-auth';
import React, { useEffect, useState } from 'react';
import { TodoItem } from '../types';
import Firebase from 'firebase';
import { validation } from '../utils/util-functions';
import { Card } from './Card';
import config from '../utils/config';
import produce from 'immer';
import * as Yup from 'yup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

export const TodosCard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const authUser = useAuthUser();
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const todosRef = Firebase.database().ref(
    config.collections.userTodos(authUser.id as string)
  );

  const getTodos = () => {
    todosRef.on('value', (snapshot) => {
      setTodos(snapshot.val() || []);
      setLoading(false);
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
    <Card loading={loading}>
      <Heading size="md" mb={4}>
        Todos
      </Heading>
      <Box>
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
                <InputControl name="name" inputProps={{ variant: 'flushed' }} />
                <IconButton
                  shadow="lg"
                  width="auto"
                  mt={1}
                  mb={2}
                  size="sm"
                  bgColor="gray.900"
                  colorScheme="blackAlpha"
                  _hover={{
                    bgColor: 'gray.700',
                  }}
                  color="white"
                  type="submit"
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
                borderWidth={snapshot.isDraggingOver ? 1 : 'inherit'}
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
      </Box>
    </Card>
  );
};

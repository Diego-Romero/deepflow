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
  CircularProgress,
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
    <Card>
      <Heading size="md" mb={4}>
        Todos
      </Heading>
      {loading ? (
        <Flex justifyContent="center" alignItems="center">
          <Box>
            <CircularProgress isIndeterminate color="blue.500" />
          </Box>
        </Flex>
      ) : (
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
                  <InputControl
                    name="name"
                    inputProps={{ variant: 'flushed' }}
                  />
                  <IconButton
                    shadow="lg"
                    width="auto"
                    mt={1}
                    mb={2}
                    size="sm"
                    borderColor="gray.900"
                    variant="outline"
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
                  bgColor={snapshot.isDraggingOver ? 'gray.100' : 'inherit'}
                  borderWidth={snapshot.isDraggingOver ? 1 : 'inherit'}
                  mt={3}
                  borderRadius="md"
                  py={2}
                >
                  {todos.map((item, index) => (
                    <Draggable
                      key={index}
                      draggableId={`${index}`}
                      index={index}
                    >
                      {(draggableProvided, draggableSnapshot) => (
                        <Flex
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          justifyContent="space-between"
                          textDecoration={
                            item.done ? 'line-through' : 'inherit'
                          }
                          color={item.done ? 'gray.600' : 'inherit'}
                          borderBottomWidth="1px"
                          width="100%"
                          _hover={{
                            bgColor: 'gray.100',
                          }}
                          alignItems="center"
                          bgColor={'white'}
                          py={2}
                          px={1}
                        >
                          <HStack>
                            <DragHandleIcon w={3} h={3} />
                            <Text noOfLines={1}>{item.name}</Text>
                          </HStack>
                          <HStack>
                            {item.done ? (
                              <>
                                <Tooltip
                                  label="Mark as undone"
                                  aria-label="mark as undone"
                                >
                                  <IconButton
                                    size="xs"
                                    variant="outline"
                                    colorScheme="yellow"
                                    backgroundColor="white"
                                    isRound
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateTodo(
                                        { ...item, done: false },
                                        index
                                      );
                                    }}
                                    icon={<RepeatIcon />}
                                    aria-label={'mark as undone'}
                                  />
                                </Tooltip>
                                <Tooltip
                                  label="Delete item"
                                  aria-label="Delete item"
                                >
                                  <IconButton
                                    size="xs"
                                    colorScheme="red"
                                    variant="outline"
                                    backgroundColor="white"
                                    isRound
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteTodo(index);
                                    }}
                                    icon={<DeleteIcon />}
                                    aria-label={'Delete item'}
                                  />
                                </Tooltip>
                              </>
                            ) : (
                              <Tooltip
                                label="Mark as done"
                                aria-label="mark as done"
                              >
                                <IconButton
                                  size="xs"
                                  variant="outline"
                                  isRound
                                  backgroundColor="white"
                                  colorScheme="gray"
                                  borderColor="gray.900"
                                  color="gray.900"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateTodo({ ...item, done: true }, index);
                                  }}
                                  icon={<CheckIcon />}
                                  aria-label={'Mark as done'}
                                />
                              </Tooltip>
                            )}
                          </HStack>
                        </Flex>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Flex>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      )}
    </Card>
  );
};

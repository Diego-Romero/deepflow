import {
  AddIcon,
  CheckIcon,
  DeleteIcon,
  DragHandleIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import Firebase from 'firebase';
import {
  Drawer,
  Text,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Stack,
  HStack,
  Tooltip,
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
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      size="sm"
      // finalFocusRef={btnRef}
    >
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
                    variant="solid"
                    colorScheme="blue"
                    shadow="lg"
                    width="auto"
                    mt={1}
                    mb={2}
                    color="white"
                    size="sm"
                    type="submit"
                    //     onClick={onCreateModalOpen}
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
                  mt={6}
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
                            bgColor: "gray.100"
                          }}
                          alignItems="center"
                          bgColor={
                            draggableSnapshot.isDragging ? 'gray.200' : 'white'
                          }
                          p={4}
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
                                    size="sm"
                                    variant="outline"
                                    colorScheme="blue"
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
                                    size="sm"
                                    colorScheme="red"
                                    variant="outline"
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
                                  size="sm"
                                  variant="outline"
                                  isRound
                                  colorScheme="blue"
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
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

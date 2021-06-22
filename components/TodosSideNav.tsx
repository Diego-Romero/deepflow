import { AddIcon, CheckIcon, DragHandleIcon } from '@chakra-ui/icons';
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
import React, { useState } from 'react';
import { TodoItem } from '../types';
import * as Yup from 'yup';
import { validation } from '../utils/util-functions';
import { InputControl } from 'formik-chakra-ui';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

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

export const mockItems: TodoItem[] = [
  { name: 'test', createdAt: Date.now(), done: false },
  { name: 'test 1', createdAt: Date.now(), done: false },
  { name: 'test 2', createdAt: Date.now(), done: false },
  { name: 'test 3', createdAt: Date.now(), done: false },
];

export const TodosSideNav: React.FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const [todos, setTodos] = useState<TodoItem[]>(mockItems);

  const addTodo = (item: TodoItem) => {
    setTodos([item, ...todos]);
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
              console.log(values);
              const item: TodoItem = {
                ...values,
                createdAt: Date.now(),
                done: false,
              };
              setTodos([item, ...todos]);
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
		  bgColor={snapshot.isDraggingOver ? "gray.100" : "inherit"}
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
                          mb={4}
                          justifyContent="space-between"
                          borderWidth="1px"
                          width="100%"
                          alignItems="center"
			  bgColor={draggableSnapshot.isDragging ? "blue.100" : "white"}
			  shadow="md"
                          p={4}
                          borderRadius="md"
                        >
                          <HStack>
                            <DragHandleIcon w={3} h={3} />
                            <Text>{item.name}</Text>
                          </HStack>
                          <HStack>
                            <Tooltip
                              label="Mark as done"
                              aria-label="mark as done"
                            >
                              <IconButton
                                size="sm"
                                variant="outline"
                                isRound
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // updateItem(columnIndex, itemIndex, {...item, done: true})
                                }}
                                icon={<CheckIcon />}
                                aria-label={'Mark as done'}
                              />
                            </Tooltip>
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

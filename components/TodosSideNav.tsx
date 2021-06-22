import { CheckIcon, DragHandleIcon } from '@chakra-ui/icons';
import {
  Drawer,
  Text,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  Button,
  Flex,
  Stack,
  HStack,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { TodoItem } from '../types';

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
  const [todos, setTodos] = useState<TodoItem[]>([]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      // finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Todos</DrawerHeader>

        <DrawerBody>
          <Input placeholder="Type here..." />
          <Flex
            flexDir="column"
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            {mockItems.map((item, index) => {
              return (
                <Flex
                  key={index}
                  mb={2}
                  justifyContent="space-between"
                  borderWidth="1px"
                  width="100%"
                  alignItems="center"
                  p={4}
                  borderRadius="md"
                >
                  <HStack>
                    <DragHandleIcon w={3} h={3} />
                    <Text>{item.name}</Text>
                  </HStack>
                  <HStack>
                    <Tooltip label="Mark as done" aria-label="mark as done">
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
              );
            })}
          </Flex>
        </DrawerBody>

        {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

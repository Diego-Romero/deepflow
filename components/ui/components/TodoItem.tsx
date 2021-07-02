import {
  DragHandleIcon,
  RepeatIcon,
  DeleteIcon,
  CheckIcon,
} from '@chakra-ui/icons';
import {
  Flex,
  HStack,
  Tooltip,
  IconButton,
  Text,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { TodoItem as TodoItemType } from '../../../types';

interface Props {
  key: number;
  index: number;
  item: TodoItemType;
  updateTodo: (item: TodoItemType, index: number) => void;
  deleteTodo: (index: number) => void;
}

export const TodoItemComponent: React.FC<Props> = (props) => {
  const { index, item, updateTodo, deleteTodo } = props;

  return (
    <Draggable key={index} draggableId={`${index}`} index={index}>
      {(draggableProvided, draggableSnapshot) => (
        <Flex
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          justifyContent="space-between"
          textDecoration={item.done ? 'line-through' : 'inherit'}
          color={item.done ? 'gray.600' : 'inherit'}
          borderWidth="1px"
          borderRadius="lg"
          mb={3}
          width="100%"
          _hover={{
            bgColor: 'gray.100',
          }}
          alignItems="center"
          // bgColor="white"
          backgroundColor="gray.50"
          py={2}
          px={2}
        >
          <HStack>
            {/* <DragHandleIcon w={3} h={3} /> */}
            <Text fontSize="sm">{item.name}</Text>
          </HStack>
          <Stack height="100%" pl={2} borderLeftWidth="1px">
            {item.done ? (
              <>
                <Tooltip label="Mark as undone" aria-label="mark as undone">
                  <IconButton
                    size="xs"
                    variant="outline"
                    colorScheme="yellow"
                    backgroundColor="white"
                    isRound
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTodo({ ...item, done: false }, index);
                    }}
                    icon={<RepeatIcon />}
                    aria-label={'mark as undone'}
                  />
                </Tooltip>
                <Tooltip label="Delete item" aria-label="Delete item">
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
              <Tooltip label="Done" aria-label="Done">
                <IconButton
                  size="xs"
                  variant="outline"
                  isRound
                  backgroundColor="white"
                  colorScheme="gray"
                  color="gray.900"
                  borderColor="gray.900"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(index);
                  }}
                  icon={<CheckIcon />}
                  aria-label={'Done'}
                />
              </Tooltip>
            )}
          </Stack>
        </Flex>
      )}
    </Draggable>
  );
};

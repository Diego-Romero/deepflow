import {
  CheckIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
} from '@chakra-ui/icons';
import {
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ColumnItem as ColItem } from '../types';
import { ItemSettingsModal } from './ItemSettingsModal';

interface Props {
  item: ColItem;
  itemIndex: number;
  columnIndex: number;
  updateItem: (columnIndex: number, itemIndex: number, item: ColItem) => void;
  deleteItem: (columnIndex: number, itemIndex: number) => void;
}

export const ColumnItem: React.FC<Props> = ({
  item,
  itemIndex,
  columnIndex,
  updateItem,
  deleteItem,
}) => {
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  return (
    <Draggable
      draggableId={`column-${columnIndex}-item-${itemIndex}`}
      index={itemIndex}
    >
      {(dragProvided, dragSnapshot) => (
        <Flex
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
          py={4}
          borderBottomWidth="1px"
          bgColor={dragSnapshot.isDragging ? 'cyan.100' : 'white'}
          textDecoration={item.done ? 'line-through' : 'inherit'}
          color={item.done ? 'gray.600' : 'inherit'}
          cursor="pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSettingsOpen();
          }}
          _hover={{
            bgColor: 'gray.100',
          }}
        >
          <Flex alignItems="center" justifyContent="center">
            <DragHandleIcon mr={1} w={3} h={3} />
            <Text noOfLines={1}>{item.name}</Text>
          </Flex>
          <HStack spacing={1}>
            <Tooltip label="Edit" aria-label="edit">
              <IconButton
                size="sm"
                variant="ghost"
                isRound
                // colorScheme="blue"
                onClick={onSettingsOpen}
                icon={<EditIcon />}
                aria-label={'Edit'}
              />
            </Tooltip>
            {!item.done ? (
              <Tooltip label="Mark as done" aria-label="mark as done">
                <IconButton
                  size="sm"
                  variant="outline"
                  colorScheme="green"
                  isRound
                  onClick={(e) => {
                    e.stopPropagation();
                    updateItem(columnIndex, itemIndex, { ...item, done: true });
                  }}
                  icon={<CheckIcon />}
                  aria-label={'Mark as done'}
                />
              </Tooltip>
            ) : (
              <Tooltip label="Delete item" aria-label="Delete item">
                <IconButton
                  size="sm"
                  variant="outline"
                  isRound
                colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(columnIndex, itemIndex);
                  }}
                  icon={<DeleteIcon />}
                  aria-label={'Delete item'}
                />
              </Tooltip>
            )}
          </HStack>
          <ItemSettingsModal
            modalOpen={isSettingsOpen}
            modalClose={onSettingsClose}
            itemIndex={itemIndex}
            colIndex={columnIndex}
            updateItem={updateItem}
            deleteItem={deleteItem}
            item={item}
          />
        </Flex>
      )}
    </Draggable>
  );
};

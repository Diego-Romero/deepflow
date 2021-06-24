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
  columnSize: number;
}

export const ColumnItem: React.FC<Props> = ({
  item,
  itemIndex,
  columnIndex,
  updateItem,
  deleteItem,
  columnSize,
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
          px={2}
          borderBottomWidth="1px"
          // bgColor={dragSnapshot.isDragging ? 'gray.100' : 'white'}
          bgColor="white"
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
            {/* <DragHandleIcon mr={1} w={2} h={2} /> */}
            <Text noOfLines={1} fontSize={columnSize <= 2 ? 'sm' : 'md'}>
              {item.name}
            </Text>
          </Flex>
          <HStack spacing={1}>
            {!item.done ? (
              <>
                <Tooltip label="Edit" aria-label="edit">
                  <IconButton
                    size="xs"
                    variant="ghost"
                    isRound
                    onClick={onSettingsOpen}
                    icon={<EditIcon />}
                    aria-label={'Edit'}
                  />
                </Tooltip>
                <Tooltip label="Mark as done" aria-label="mark as done">
                  <IconButton
                    size="xs"
                    variant="outline"
                    colorScheme="gray"
                    isRound
                    backgroundColor="white"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateItem(columnIndex, itemIndex, {
                        ...item,
                        done: true,
                      });
                    }}
                    icon={<CheckIcon />}
                    aria-label={'Mark as done'}
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip label="Delete item" aria-label="Delete item">
                  <IconButton
                    size="xs"
                    variant="outline"
                    isRound
                    colorScheme="orange"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(columnIndex, itemIndex);
                    }}
                    icon={<DeleteIcon />}
                    aria-label={'Delete item'}
                  />
                </Tooltip>
              </>
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

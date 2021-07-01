import {
  CheckIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
  RepeatIcon,
} from '@chakra-ui/icons';
import {
  Divider,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ColumnItem as ColItem } from '../types';
import { shortDateFormat } from '../utils/util-functions';
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
          // px={1}
          py={3}
          // borderBottomWidth="1px"
          // bgColor={dragSnapshot.isDragging ? 'gray.100' : 'white'}
          mb={3}
          bgColor="gray.50"
          textDecoration={item.done ? 'line-through' : 'inherit'}
          color={item.done ? 'gray.600' : 'inherit'}
          borderWidth="1px"
          shadow="sm"
          p={2}
          cursor="pointer"
          borderRadius="md"
          onClick={(e) => {
            e.stopPropagation();
            onSettingsOpen();
          }}
          _hover={{
            bgColor: 'gray.100',
          }}
        >
          {/* <DragHandleIcon mr={1} w={2} h={2} /> */}
          <Stack>
            <Text textAlign="left" fontSize={'sm'}>
              {item.name}
            </Text>
            <Text textAlign="left" fontSize={'xs'} color="gray.600">
              {shortDateFormat(item.createdAt)}
            </Text>
          </Stack>
          <HStack>
            <Stack spacing={2} ml={2} borderLeftWidth={1} pl={2}>
              {!item.done ? (
                <>
                  <Tooltip label="Done?" aria-label="mark as done">
                    <IconButton
                      size="xs"
                      variant="outline"
                      colorScheme="green"
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
                  <Tooltip label="Edit" aria-label="edit">
                    <IconButton
                      size="xs"
                      variant="outline"
                      isRound
                      backgroundColor="white"
                      onClick={onSettingsOpen}
                      icon={<EditIcon />}
                      aria-label={'Edit'}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip label="Return" aria-label="move back">
                    <IconButton
                      size="xs"
                      variant="outline"
                      isRound
                      // colorScheme="green"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateItem(columnIndex, itemIndex, {
                          ...item,
                          done: false,
                        });
                      }}
                      icon={<RepeatIcon />}
                      aria-label={'move back'}
                    />
                  </Tooltip>
                  <Tooltip label="Delete" aria-label="Delete item">
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
            </Stack>
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

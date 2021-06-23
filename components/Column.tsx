import { AddIcon, DragHandleIcon, EditIcon } from '@chakra-ui/icons';
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Tooltip,
  useColorMode,
  useDisclosure,
  Grid,
  Divider,
} from '@chakra-ui/react';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ColumnItem as ColItem, Column as Col } from '../types';
import { ColumnItem } from './ColumnItem';
import { ColumnSettingsModal } from './ColumnSettingsModal';
import { CreateItemModal } from './CreateItemModal';

interface Props {
  column: Col;
  columnIndex: number;
  createNewItem: (listIndex: number, name: string) => void;
  updateItem: (columnIndex: number, itemIndex: number, item: ColItem) => void;
  deleteItem: (columnIndex: number, itemIndex: number) => void;
  deleteColumn: (index: number) => void;
  updateColumn: (name: string, index: number) => void;
  columnSize: number;
}

export const Column: React.FC<Props> = ({
  column,
  columnIndex,
  createNewItem,
  deleteColumn,
  updateColumn,
  updateItem,
  deleteItem,
  columnSize,
}) => {
  const {
    isOpen: isCreateItemModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const { colorMode } = useColorMode();

  function calculateColSize(n: number): string {
    const sizes = {
      1: '250px',
      2: '300px',
      3: '350px',
      4: '400px',
      5: '450px',
    };
    return sizes[n];
  }

  return (
    <Draggable draggableId={`column-${columnIndex}`} index={columnIndex}>
      {(provided, snapshot) => (
        <Flex
          ref={provided.innerRef}
          {...provided.draggableProps}
          mr={4}
          minH="70vh"
          flexDir="column"
          borderRadius="lg"
          width={calculateColSize(columnSize)}
          bgColor={snapshot.isDragging ? 'gray.100' : 'white'}
          shadow="lg"
          borderWidth="1px"
          py={4}
          px={3}
        >
          <Flex
            flexDir="row"
            mb={4}
            alignItems="center"
            justifyContent="space-between"
            onClick={(e) => {
              e.stopPropagation();
              onSettingsOpen();
            }}
            {...provided.dragHandleProps}
          >
            <Flex alignItems="center" justifyContent="center">
              <DragHandleIcon mr={1} w={3} h={3} />
              <Heading size="md" noOfLines={1}>
                {column.name}
              </Heading>
            </Flex>
            <HStack spacing={1}>
              <Tooltip label="Edit" aria-label="edit">
                <IconButton
                  size="sm"
                  variant="ghost"
                  isRound
                  onClick={onSettingsOpen}
                  icon={<EditIcon />}
                  aria-label={'Column settings'}
                />
              </Tooltip>
              {/* <Tooltip label="Create new item" aria-label="Create new item">
                <IconButton
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  isRound
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateModalOpen();
                  }}
                  icon={<AddIcon />}
                  aria-label={"Create new item"}
                />
              </Tooltip> */}
            </HStack>
          </Flex>

          <Divider />

          <Droppable droppableId={`column-${columnIndex}`} type="item">
            {(itemsProvided, itemsSnapshot) => (
              <Flex
                flexDir="column"
                ref={itemsProvided.innerRef}
                {...itemsProvided.droppableProps}
                bg={
                  itemsSnapshot.isDraggingOver
                      ? 'gray.100'
                      : 'inherit'
                }
                height="100%"
              >
                {column.items
                  ? column.items.map((item, itemIndex) => (
                      <ColumnItem
                        key={itemIndex.toString()}
                        item={item}
                        itemIndex={itemIndex}
                        columnIndex={columnIndex}
                        updateItem={updateItem}
                        deleteItem={deleteItem}
                      />
                    ))
                  : null}
                {itemsProvided.placeholder}

                <Tooltip label="Create new item" aria-label="Create new item">
                  <IconButton
                    variant="solid"
                    colorScheme="blue"
                    shadow="lg"
                    width="auto"
                    mt={3}
                    mb={2}
                    color="white"
                    size="sm"
                    onClick={onCreateModalOpen}
                    icon={<AddIcon />}
                    aria-label={'create new item'}
                  />
                </Tooltip>
              </Flex>
            )}
          </Droppable>
          <CreateItemModal
            modalOpen={isCreateItemModalOpen}
            modalClose={onCreateModalClose}
            createNewItem={createNewItem}
            columnIndex={columnIndex}
          />
          <ColumnSettingsModal
            modalOpen={isSettingsOpen}
            modalClose={onSettingsClose}
            deleteColumn={deleteColumn}
            updateColumn={updateColumn}
            index={columnIndex}
            name={column.name}
          />
        </Flex>
      )}
    </Draggable>
  );
};

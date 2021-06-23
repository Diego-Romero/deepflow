import {
  AddIcon,
  DragHandleIcon,
  EditIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import {
  Flex,
  Box,
  Heading,
  HStack,
  IconButton,
  Stack,
  Tooltip,
  useColorMode,
  useDisclosure,
  Grid,
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
  columnSize
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
      1: "150px",
      2: "250px",
      3: "350px",
      4: "450px",
      5: "550px",
    }
    return sizes[n];
  }

  return (
    <Draggable draggableId={`column-${columnIndex}`} index={columnIndex}>
      {(provided, snapshot) => (
        <Grid
          ref={provided.innerRef}
          {...provided.draggableProps}
          mr={4}
          gridTemplateRows="auto 1fr"
          minH="70vh"
          borderRadius="md"
          width={calculateColSize(columnSize)}
          bgColor={
            colorMode === 'light'
              ? snapshot.isDragging
                ? 'white'
                : 'gray.100'
              : 'gray.800'
          }
          shadow="md"
          borderWidth="1px"
        >
          <Flex
            flexDir="row"
            mb={4}
            px="2"
            pt="2"
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

          <Droppable droppableId={`column-${columnIndex}`} type="item">
            {(itemsProvided, itemsSnapshot) => (
              <Flex
                flexDir="column"
                ref={itemsProvided.innerRef}
                {...itemsProvided.droppableProps}
                p="2"
                bg={
                  itemsSnapshot.isDraggingOver
                    ? colorMode === 'light'
                      ? 'gray.200'
                      : 'gray.700'
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
                    mt={1}
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
        </Grid>
      )}
    </Draggable>
  );
};

import { AddIcon, DragHandleIcon, EditIcon } from '@chakra-ui/icons';
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Tooltip,
  useDisclosure,
  Divider,
  Grid,
} from '@chakra-ui/react';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ColumnItem as ColItem, Column as Col } from '../../../types';
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
        <Grid
          ref={provided.innerRef}
          {...provided.draggableProps}
          mr={4}
          minH="70vh"
          // flexDir="column"
          borderRadius="lg"
          width={calculateColSize(columnSize)}
          shadow={snapshot.isDragging ? 'lg' : 'md'}
          bgColor="white"
          // shadow="md"
          borderWidth="1px"
          pb={4}
          px={3}
          gridTemplateRows="auto 1fr"
        >
          <Flex
            flexDir="row"
            pt={4}
            pb={4}
            alignItems="center"
            _hover={{ textDecor: 'bold' }}
            justifyContent="space-between"
            onClick={(e) => {
              e.stopPropagation();
              onSettingsOpen();
            }}
            {...provided.dragHandleProps}
          >
            <Flex alignItems="center" justifyContent="center">
              <DragHandleIcon mr={1} w={3} h={3} />
              <Heading size="sm" noOfLines={1}>
                {column.name}
              </Heading>
            </Flex>
            <HStack spacing={1}>
              <Tooltip label="Edit" aria-label="edit">
                <IconButton
                  size="xs"
                  variant="ghost"
                  isRound
                  onClick={onSettingsOpen}
                  icon={<EditIcon />}
                  aria-label={'Column settings'}
                />
              </Tooltip>
            </HStack>
          </Flex>

          {/* <Divider /> */}

          <Droppable droppableId={`column-${columnIndex}`} type="item">
            {(itemsProvided, itemsSnapshot) => (
              <Flex
                flexDir="column"
                ref={itemsProvided.innerRef}
                {...itemsProvided.droppableProps}
                // bg={itemsSnapshot.isDraggingOver ? 'gray.50' : 'inherit'}
                // borderWidth={itemsSnapshot.isDraggingOver ? '1px' : 'inherit'}
                borderRadius="md"
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
                        columnSize={columnSize}
                      />
                    ))
                  : null}
                {itemsProvided.placeholder}
                <Tooltip label="New" aria-label="Create new item">
                  <IconButton
                    variant="outline"
                    shadow="sm"
                    width="auto"
                    size={'sm'}
                    my={1}
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

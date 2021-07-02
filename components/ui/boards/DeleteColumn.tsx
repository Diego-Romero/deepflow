import {
  AddIcon,
  DeleteIcon,
  DragHandleIcon,
  EditIcon,
} from '@chakra-ui/icons';
import {
  Flex,
  Heading,
  HStack,
  IconButton,
  Tooltip,
  Divider,
} from '@chakra-ui/react';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ColumnItem } from './ColumnItem';
import { ColumnSettingsModal } from './ColumnSettingsModal';
import { CreateItemModal } from './CreateItemModal';

interface Props {
  // column: Col;
  columnIndex: number;
  // createNewItem: (listIndex: number, name: string) => void;
  // updateItem: (columnIndex: number, itemIndex: number, item: ColItem) => void;
  // deleteItem: (columnIndex: number, itemIndex: number) => void;
  // deleteColumn: (index: number) => void;
  // updateColumn: (name: string, index: number) => void;
  // columnSize: number;
}

export const DeleteColumn: React.FC<Props> = ({
  // column,
  columnIndex,
  // createNewItem,
  // deleteColumn,
  // updateColumn,
  // updateItem,
  // deleteItem,
  // columnSize,
}) => {
  return (
    <Draggable draggableId={`column-delete`} index={columnIndex}>
      {(provided, snapshot) => (
        <Flex
          ref={provided.innerRef}
          {...provided.draggableProps}
          mr={4}
          minH="70vh"
          flexDir="column"
          borderRadius="lg"
          // width={calculateColSize(columnSize)}
          shadow={snapshot.isDragging ? 'lg' : 'md'}
          bgColor="red.50"
          // shadow="md"
          borderWidth="1px"
          // py={4}
          px={3}
        >
          <Flex
            flexDir="row"
            py={4}
            px={4}
            alignItems="center"
            _hover={{ textDecor: 'bold' }}
            justifyContent="space-between"
            {...provided.dragHandleProps}
          >
            <Flex alignItems="center" justifyContent="center">
              <DeleteIcon mr={1} w={4} h={4} />
              {/* <Heading size="sm" noOfLines={1}>
								Delete
              </Heading> */}
            </Flex>
          </Flex>

          <Droppable droppableId={`column-${columnIndex}`} type="delete">
            {(itemsProvided, itemsSnapshot) => (
              <Flex
                flexDir="column"
                ref={itemsProvided.innerRef}
                {...itemsProvided.droppableProps}
                bg={itemsSnapshot.isDraggingOver ? 'gray.200' : 'inherit'}
                height="100%"
              >
                {/* {column.items
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
                  : null} */}
                {itemsProvided.placeholder}
              </Flex>
            )}
          </Droppable>
        </Flex>
      )}
    </Draggable>
  );
};

import {
  AddIcon,
  DragHandleIcon,
  EditIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { ColumnType as Col } from "../types";
import { ColumnItem } from "./ColumnItem";
import { ColumnSettingsModal } from "./ColumnSettingsModal";
import { CreateItemModal } from "./CreateItemModal";

interface Props {
  column: Col;
  index: number;
  createNewItem: (listIndex: number, name: string) => void;
  deleteColumn: (index: number) => void;
  updateColumn: (name: string, index: number) => void;
}

export const Column: React.FC<Props> = ({
  column,
  index,
  createNewItem,
  deleteColumn,
  updateColumn,
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
  return (
    <Draggable draggableId={index.toString()} index={index}>
      {/* <Draggable draggableId={column.id} index={index}> */}
      {(provided, snapshot) => (
        <Flex
          ref={provided.innerRef}
          {...provided.draggableProps}
          mr={4}
          p={2}
          minH="70vh"
          onClick={(e) => {
            e.stopPropagation();
            onCreateModalOpen();
          }}
          borderRadius="md"
          width={["90vw", "45vw", "250px", "350px"]}
          bgColor={
            colorMode === "light"
              ? snapshot.isDragging
                ? "gray.100"
                : "white"
              : "gray.800"
          }
          shadow="sm"
          borderWidth="1px"
          flexDir="column"
        >
          <Flex
            flexDir="row"
            pb={4}
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
                  // colorScheme="yellow"
                  isRound
                  onClick={onSettingsOpen}
                  icon={<EditIcon />}
                  aria-label={"Column settings"}
                />
              </Tooltip>
              <Tooltip label="Create new item" aria-label="Create new item">
                <IconButton
                  size="sm"
                  variant="solid"
                  colorScheme="purple"
                  isRound
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateModalOpen();
                  }}
                  icon={<AddIcon />}
                  aria-label={"Create new item"}
                />
              </Tooltip>
            </HStack>
          </Flex>

          <Droppable droppableId={`column-${index}`} type="item">
            {(itemsProvided, _itemsSnapshot) => (
              <Stack
                ref={itemsProvided.innerRef}
                {...itemsProvided.droppableProps}
              >
                {column.items
                  ? column.items.map((item, index) => (
                      <ColumnItem
                        key={index.toString()}
                        item={item}
                        index={index}
                      />
                    ))
                  : null}
                {itemsProvided.placeholder}
              </Stack>
            )}
          </Droppable>
          <CreateItemModal
            modalOpen={isCreateItemModalOpen}
            modalClose={onCreateModalClose}
            createNewItem={createNewItem}
            columnIndex={index}
          />
          <ColumnSettingsModal
            modalOpen={isSettingsOpen}
            modalClose={onSettingsClose}
            deleteColumn={deleteColumn}
            updateColumn={updateColumn}
            index={index}
            name={column.name}
          />
        </Flex>
      )}
    </Draggable>
  );
};

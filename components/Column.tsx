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
  Grid,
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
    <Draggable draggableId={`column-${index}`} index={index}>
      {(provided, snapshot) => (
        <Grid
          ref={provided.innerRef}
          {...provided.draggableProps}
          mr={4}
          p={2}
          gridTemplateRows="auto 1fr"
          minH="70vh"
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
            {(itemsProvided, itemsSnapshot) => (
              <Flex
                flexDir="column"
                ref={itemsProvided.innerRef}
                {...itemsProvided.droppableProps}
                // bgColor={itemsSnapshot.isDraggingOver ? "gray.500" : "inherit"}

                      bg={
                        itemsSnapshot.isDraggingOver
                          ? colorMode === "light"
                            ? "gray.200"
                            : "gray.700"
                          : "inherit"
                      }
                height="100%"
              >
                {column.items
                  ? column.items.map((item, itemIndex) => (
                      <ColumnItem
                        key={itemIndex.toString()}
                        item={item}
                        index={itemIndex}
                        columnIndex={index}
                      />
                    ))
                  : null}
                {itemsProvided.placeholder}
              </Flex>
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
        </Grid>
      )}
    </Draggable>
  );
};

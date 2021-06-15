import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
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
    <Box width="300px">
      <Draggable draggableId={column.id} index={index}>
        {(provided, snapshot) => (
          <Stack
            ref={provided.innerRef}
            bg={snapshot.isDragging ? "purple.100" : "inherit"}
            {...provided.draggableProps}
            mr={4}
            p={2}
            borderRadius="md"
            borderWidth="1px"
            bgColor={colorMode === "light" ? "gray.100" : "gray.900"}
            shadow="sm"
          >
            <Flex
              flexDir="row"
              pb={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading size="md" noOfLines={1} {...provided.dragHandleProps}>
                {column.name}
              </Heading>
              <HStack spacing={1}>
                <Tooltip label="Column settings" aria-label="Column settings">
                  <IconButton
                    size="sm"
                    variant="outline"
                    colorScheme="gray"
                    isRound
                    onClick={onSettingsOpen}
                    icon={<SettingsIcon />}
                    aria-label={"Column settings"}
                  />
                </Tooltip>
                <Tooltip label="Create new item" aria-label="Create new item">
                  <IconButton
                    size="sm"
                    variant="outline"
                    //     colorScheme="purple"
                    isRound
                    onClick={onCreateModalOpen}
                    icon={<AddIcon />}
                    aria-label={"Create new item"}
                  />
                </Tooltip>
              </HStack>
            </Flex>

            <Droppable droppableId={`${index}`} type="item">
              {(itemsProvided, _itemsSnapshot) => (
                <Stack
                  ref={itemsProvided.innerRef}
                  {...itemsProvided.droppableProps}
                >
                  {column.items.map((item, index) => (
                    <ColumnItem key={item.id} item={item} index={index} />
                  ))}
                  {itemsProvided.placeholder}
                </Stack>
              )}
            </Droppable>
          </Stack>
        )}
      </Draggable>
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
      />
    </Box>
  );
};

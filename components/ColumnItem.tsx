import { DragHandleIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { ColumnItemType as ColItem, ColumnItemType } from "../types";
import { ItemSettingsModal } from "./ItemSettingsModal";

interface Props {
  item: ColItem;
  itemIndex: number;
  columnIndex: number;
  updateItem: (
    columnIndex: number,
    itemIndex: number,
    item: ColumnItemType
  ) => void;
  deleteItem: (columnIndex: number, itemIndex: number) => void;
}

export const ColumnItem: React.FC<Props> = ({
  item,
  itemIndex,
  columnIndex,
  updateItem,
  deleteItem,
}) => {
  const { colorMode } = useColorMode();
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
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bgColor={
            colorMode === "light"
              ? dragSnapshot.isDragging
                ? "cyan.100"
                : "white"
              : "gray.900"
          }
          shadow={dragSnapshot.isDragging ? "lg" : "sm"}
          cursor="pointer"
          mb={2}
          onClick={(e) => {
            e.stopPropagation();
            onSettingsOpen();
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
                variant="outline"
                isRound
                onClick={onSettingsOpen}
                icon={<EditIcon />}
                aria-label={"Edit"}
              />
            </Tooltip>
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

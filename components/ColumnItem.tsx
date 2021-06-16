import { Flex, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { ColumnItemType as ColItem } from "../types";

export const ColumnItem: React.FC<{
  item: ColItem;
  index: number;
  columnIndex: number;
}> = ({ item, index, columnIndex }) => {
  const { colorMode } = useColorMode();
  return (
    <Draggable
      draggableId={`column-${columnIndex}-item-${index}`}
      index={index}
    >
      {(dragProvided, dragSnapshot) => (
        <Flex
          borderWidth="1px"
          borderRadius="md"
          // bgColor={colorMode === "light" ? "white" : "inherit"}
          bgColor={
            colorMode === "light"
              ? dragSnapshot.isDragging
                ? "gray.100"
                : "white"
              : "gray.800"
          }
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          style={{ ...dragProvided.draggableProps.style }}
          p={4}
          alignItems="center"
          shadow={dragSnapshot.isDragging ? "lg" : "sm"}
          cursor="pointer"
          mb={2}
        >
          <Text ml={1} noOfLines={1}>
            {item.name}
          </Text>
        </Flex>
      )}
    </Draggable>
  );
};

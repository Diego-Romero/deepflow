import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { ColumnItemType as ColItem } from "../types";

export const ColumnItem: React.FC<{ item: ColItem; index: number }> = ({
  item,
  index,
}) => (
  <Draggable key={item.id} draggableId={item.id} index={index}>
    {(dragProvided, dragSnapshot) => (
      <Flex
        borderWidth="1px"
        borderRadius="md"
        bgColor="white"
        ref={dragProvided.innerRef}
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
        style={{ ...dragProvided.draggableProps.style }}
        _hover={{
          shadow: dragSnapshot.isDragging ? "lg" : "sm",
        }}
        p={4}
        alignItems="center"
        shadow={dragSnapshot.isDragging ? "lg" : "sm"}
        cursor="pointer"
      >
        <Text ml={1} noOfLines={1}>
          {item.name}
        </Text>
      </Flex>
    )}
  </Draggable>
);

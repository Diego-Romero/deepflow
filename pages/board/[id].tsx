import React, { useState } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import {
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import { PageLayout } from "../../components/PageLayout";
import { Card } from "../../components/Card";
import FullPageLoader from "../../components/FullPageLoader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import produce from "immer";
import { column, columnItem } from "../../types";
import {
  generateMockColumn,
  move,
  reorder,
  reorderList,
} from "../../utils/util-functions";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";
import { IoMdPlay } from "react-icons/io";

const BoardPage = () => {
  const AuthUser = useAuthUser();
  const { colorMode } = useColorMode();
  const [columns, setColumns] = useState<column[]>([
    generateMockColumn("todo", 1, 20),
    generateMockColumn("doing", 2, 3),
    generateMockColumn("done", 3, 5),
    generateMockColumn("monday", 4, 4),
    generateMockColumn("tuesday", 5, 4),
    generateMockColumn("wednesday", 6, 4),
    generateMockColumn("column with a very long name", 7, 4),
    generateMockColumn("testing", 8, 4),
    generateMockColumn("testing 2", 9, 4),
  ]);

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (result.type === "column") {
      const columnOrder = reorderList(columns, source.index, destination.index);
      setColumns(columnOrder);
      return;
    }

    const sourceIndex = +source.droppableId;
    const destinationIndex = +destination.droppableId;
    if (sourceIndex === destinationIndex) {
      // if moving around the same list
      const items = reorder(
        columns[sourceIndex].items,
        source.index,
        destination.index
      ) as columnItem[];
      const newState = produce(columns, (draft) => {
        draft[sourceIndex].items = items;
      });
      setColumns(newState);
    } else {
      // moving around 2 diff columns
      const result = move(
        columns[sourceIndex],
        columns[destinationIndex],
        source,
        destination
      );
      const updatedColumns = produce(columns, (draft) => {
        draft[sourceIndex].items = result[sourceIndex];
        draft[destinationIndex].items = result[destinationIndex];
      });
      setColumns(updatedColumns);
    }
  }

  const BoardHeader = () => (
    <Flex alignItems="center" justifyContent="space-between" mb={8}>
      <Heading noOfLines={1} isTruncated>
        Board name goes here
      </Heading>
      <ButtonGroup spacing={[2]} variant="outline" size={"lg"}>
        <Tooltip label="Start Pomodoro">
          <IconButton
            isRound
            aria-label="Start"
            colorScheme="purple"
            variant="solid"
            icon={<IoMdPlay />}
          />
        </Tooltip>
        <Tooltip label="Add Row">
          <IconButton
            isRound
            aria-label="Add row"
            colorScheme="purple"
            icon={<AddIcon />}
          />
        </Tooltip>
        <Tooltip label="Open settings">
          <IconButton isRound aria-label="Settings" icon={<SettingsIcon />} />
        </Tooltip>
      </ButtonGroup>
    </Flex>
  );

  const Item: React.FC<{ item: columnItem; index: number }> = ({
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
          shadow={dragSnapshot.isDragging ? "lg" : "sm"}
          cursor="pointer"
        >
          <Text noOfLines={1}>{item.name}</Text>
        </Flex>
      )}
    </Draggable>
  );

  const Column: React.FC<{ column: column; index: number }> = ({
    column,
    index,
  }) => (
    <Draggable draggableId={column.id} index={index}>
      {(provided, snapshot) => (
        <Stack
          width={["14rem"]}
          ref={provided.innerRef}
          bg={snapshot.isDragging ? "teal.100" : "inherit"}
          {...provided.draggableProps}
          mr={4}
        >
          <Heading size="md" noOfLines={1} {...provided.dragHandleProps}>
            {column.name}
          </Heading>

          <Droppable droppableId={`${index}`} type="item">
            {(itemsProvided, itemsSnapshot) => (
              <Stack
                ref={itemsProvided.innerRef}
                borderRadius="md"
                borderWidth={itemsSnapshot.isDraggingOver ? "3px" : "1px"}
                bgColor={colorMode === "light" ? "gray.100" : "gray.900"}
                shadow="sm"
                p={2}
                {...itemsProvided.droppableProps}
              >
                {column.items.map((item, index) => (
                  <Item key={item.id} item={item} index={index} />
                ))}
                {itemsProvided.placeholder}
              </Stack>
            )}
          </Droppable>
        </Stack>
      )}
    </Draggable>
  );

  const Columns = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <HStack overflow="auto" align="flex-start">
        <Droppable
          droppableId="board"
          direction="horizontal"
          type="column"
          isCombineEnabled={false}
        >
          {(provided) => (
            <Flex {...provided.droppableProps} ref={provided.innerRef} maxW="90vw" overflowX="auto">
              {columns.map((column, index) => (
                <Column column={column} index={index} key={column.id} />
              ))}
            </Flex>
          )}
        </Droppable>
      </HStack>
    </DragDropContext>
  );

  return (
    <PageLayout>
      <Flex px={8} py={8} flexDir="column">
        <BoardHeader />
        <Columns />
      </Flex>
    </PageLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(BoardPage);

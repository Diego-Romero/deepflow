import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth";
import { Flex, HStack, useDisclosure } from "@chakra-ui/react";
import Firebase from "firebase";
import { PageLayout } from "../../components/PageLayout";
import FullPageLoader from "../../components/FullPageLoader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import produce from "immer";
import { ColumnType, ColumnItemType, BoardType } from "../../types";
import {
  generateMockColumn,
  move,
  reorder,
  reorderList,
} from "../../utils/util-functions";
import { BoardHeader } from "../../components/BoardHeader";
import { Column } from "../../components/Column";
import { CreateColumnModal } from "../../components/CreateColumnModal";
import { BoardSettingsModal } from "../../components/BoardSettingsModal";
import { useRouter } from "next/router";

const BoardPage = () => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const authUser = useAuthUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = router.query;
  const [name, setName] = useState("Loading");
  const dbPath = `/${authUser.id}/boards/${id}`;
  const boardDbRef = Firebase.database().ref(dbPath);
  console.log(id, dbPath);

  const getBoard = () => {
    boardDbRef.on("value", (snapshot) => {
      console.log(snapshot.val());
      const board = snapshot.val() as BoardType;
      setName(board.name);
      if (board.columns) setColumns(board.columns);
    });
  };

  useEffect(() => {
    // const cols: ColumnType[] = [
    //   generateMockColumn("todo", 1, 10),
    //   generateMockColumn("doing", 2, 3),
    //   generateMockColumn("done", 3, 5),
    //   generateMockColumn("monday", 4, 4),
    //   generateMockColumn("tuesday", 5, 4),
    //   generateMockColumn("wednesday", 6, 4),
    //   generateMockColumn("column with a very long name", 7, 4),
    //   generateMockColumn("testing", 8, 4),
    //   generateMockColumn("testing 2", 9, 4),
    // ];
    // setColumns(cols);
    getBoard();
  }, []);

  const createNewItem = (listIndex: number, name: string) => {
    const next = produce(columns, (draft) => {
      draft[listIndex].items = [
        { name, id: new Date().getTime().toString() },
        ...columns[listIndex].items,
      ];
    });
    setColumns(next);
  };

  const createNewColumn = (name: string) => {
    setColumns([
      ...columns,
      { name, id: new Date().getTime().toString(), items: [] },
    ]);
  };

  const deleteColumn = (index: number) => {
    const clone = [...columns];
    clone.splice(index, 1);
    setColumns(clone);
  };

  const updateColumn = (name: string, index: number) => {
    const next = produce(columns, (draft) => {
      draft[index].name = name;
    });
    setColumns(next);
  };

  const updateBoard = (name: string) => {
    console.log(name);
    const updatedBoard = { name, columns, id };
    boardDbRef.set(updatedBoard)
  };

  const deleteBoard = () => {
    // todo: delete board goes here
    alert("implement delete board");
  };

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
      ) as ColumnItemType[];
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

  return (
    <PageLayout>
      <Flex px={8} py={8} flexDir="column">
        <BoardHeader
          openNewColumnModal={onOpen}
          openSettings={onSettingsOpen}
          name={name}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <HStack align="flex-start">
            <Droppable droppableId="board" direction="horizontal" type="column">
              {(provided) => (
                <Flex
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  flexDir="row"
                  justifyContent="center"
                  alignItems="flex-start"
                >
                  {columns.map((column, index) => (
                    <Column
                      column={column}
                      index={index}
                      key={column.id}
                      createNewItem={createNewItem}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                    />
                  ))}
                  {provided.placeholder}
                </Flex>
              )}
            </Droppable>
          </HStack>
        </DragDropContext>
      </Flex>
      <CreateColumnModal
        modalOpen={isOpen}
        modalClose={onClose}
        createColumn={createNewColumn}
      />
      <BoardSettingsModal
        modalOpen={isSettingsOpen}
        modalClose={onSettingsClose}
        updateBoard={updateBoard}
        deleteBoard={deleteBoard}
      />
    </PageLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(BoardPage);

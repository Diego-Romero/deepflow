import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth";
import { Box, Divider, Flex, useColorMode, useDisclosure } from "@chakra-ui/react";
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
import config from "../../utils/config";

const BoardPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const { colorMode } = useColorMode();
  const authUser = useAuthUser();
  const router = useRouter();
  const { id } = router.query;
  const [board, setBoard] = useState<BoardType | null>(null);
  const dbPath = `/${authUser.id}/boards/${id}`;
  const boardDbRef = Firebase.database().ref(dbPath);
  console.log(id, dbPath);

  const getBoard = () => {
    boardDbRef.on("value", (snapshot) => {
      const board = snapshot.val() as BoardType;
      setBoard(board);
    });
  };

  const updateBoard = (nextBoard: BoardType) => {
    boardDbRef.set(nextBoard);
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
    const columns = produce(board!.columns, (draft) => {
      draft[listIndex].items = [{ name }, ...board!.columns[listIndex].items];
    });
    setBoard({ ...board!, columns });
  };

  const createNewColumn = (name: string) => {
    const columns = [...board!.columns, { name, items: [] }];
    const nextBoard = { ...board!, columns };
    updateBoard(nextBoard);
  };

  const deleteColumn = (index: number) => {
    const columns = [...board!.columns];
    columns.splice(index, 1);
    updateBoard({ ...board!, columns });
  };

  const updateColumn = (name: string, index: number) => {
    const columns = produce(board!.columns, (draft) => {
      draft[index].name = name;
    });
    setBoard({ ...board!, columns });
  };

  const updateBoardMetadata = (name: string) => {
    const updatedBoard = { ...board!, name };
    updateBoard(updatedBoard);
  };

  const deleteBoard = () => {
    boardDbRef.remove();
    router.push(config.routes.boards);
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (result.type === "column") {
      const columnOrder = reorderList(
        board!.columns,
        source.index,
        destination.index
      );
      setBoard({ ...board!, columns: columnOrder });
      return;
    }

    const sourceIndex = +source.droppableId;
    const destinationIndex = +destination.droppableId;
    console.log(sourceIndex, destinationIndex);
    if (sourceIndex === destinationIndex) {
      // if moving around the same list
      const items = reorder(
        board!.columns[sourceIndex].items,
        source.index,
        destination.index
      ) as ColumnItemType[];
      const columns = produce(board!.columns, (draft) => {
        draft[sourceIndex].items = items;
      });
      setBoard({ ...board!, columns });
      return;
    } else {
      // moving around 2 diff columns
      const result = move(
        board!.columns[sourceIndex],
        board!.columns[destinationIndex],
        source,
        destination
      );
      const columns = produce(board!.columns, (draft) => {
        draft[sourceIndex].items = result[sourceIndex];
        draft[destinationIndex].items = result[destinationIndex];
      });
      setBoard({ ...board!, columns });
    }
  }

  return (
    <PageLayout>
      {board === null ? (
        <FullPageLoader />
      ) : (
        <Box>
          <Flex
            px={8}
            py={8}
            flexDir="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <BoardHeader
              openNewColumnModal={onOpen}
              openSettings={onSettingsOpen}
              name={board.name}
            />
            <Divider mb={8} />
            <Box>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="board"
                  direction="horizontal"
                  type="column"
                >
                  {(provided, snapshot) => (
                    <Flex
                      flexDir="row"
                      ref={provided.innerRef}
                      justifyContent="center"
                      {...provided.droppableProps}
                      alignItems="flex-start"
                      bg={snapshot.isDraggingOver ? colorMode === "light" ? "gray.200" : "gray.700" : "inherit"}
                    >
                      {board.columns.map((column, index) => (
                        <Column
                          column={column}
                          index={index}
                          key={index}
                          createNewItem={createNewItem}
                          deleteColumn={deleteColumn}
                          updateColumn={updateColumn}
                        />
                      ))}
                      {provided.placeholder}
                    </Flex>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          </Flex>
          <CreateColumnModal
            modalOpen={isOpen}
            modalClose={onClose}
            createColumn={createNewColumn}
          />
          <BoardSettingsModal
            modalOpen={isSettingsOpen}
            modalClose={onSettingsClose}
            boardName={board!.name}
            updateBoard={updateBoardMetadata}
            deleteBoard={deleteBoard}
          />
        </Box>
      )}
    </PageLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(BoardPage);

import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth";
import {
  Box,
  Divider,
  Flex,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import Firebase from "firebase";
import { PageLayout } from "../../components/PageLayout";
import FullPageLoader from "../../components/FullPageLoader";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import produce from "immer";
import { ColumnItemType, BoardType } from "../../types";
import { move, reorder, reorderList } from "../../utils/util-functions";
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

  const getBoard = () => {
    boardDbRef.on("value", (snapshot) => {
      const board = snapshot.val() as BoardType;
      setBoard(board);
    });
  };

  const firebaseUpdateBoard = (nextBoard: BoardType) => {
    boardDbRef.set(nextBoard);
  };

  useEffect(() => {
    getBoard();
  }, []);

  const createNewItem = (listIndex: number, name: string) => {
    const columns = produce(board!.columns, (draft) => {
      draft[listIndex].items = [{ name }, ...board!.columns[listIndex].items];
    });
    firebaseUpdateBoard({ ...board!, columns });
  };

  const createNewColumn = (name: string) => {
    const columns = [...board!.columns, { name, items: [] }];
    const nextBoard = { ...board!, columns };
    firebaseUpdateBoard(nextBoard);
  };

  const deleteColumn = (index: number) => {
    const columns = [...board!.columns];
    columns.splice(index, 1);
    firebaseUpdateBoard({ ...board!, columns });
  };

  const updateColumn = (name: string, index: number) => {
    const columns = produce(board!.columns, (draft) => {
      draft[index].name = name;
    });
    setBoard({ ...board!, columns });
  };

  const updateBoardMetadata = (name: string) => {
    const updatedBoard = { ...board!, name };
    firebaseUpdateBoard(updatedBoard);
  };

  const deleteBoard = () => {
    boardDbRef.remove();
    router.push(config.routes.dashboard);
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (result.type === "column") {
      const columns = reorderList(
        board!.columns,
        source.index,
        destination.index
      );
      firebaseUpdateBoard({ ...board!, columns });
      return;
    }

    const sourceColumnIndex = parseInt(source.droppableId.split("-")[1]); // getting column index with the id
    const destinationColumnIndex = parseInt(
      destination.droppableId.split("-")[1]
    ); // getting column index with the id

    if (source.droppableId === destination.droppableId) {
      // if moving around the same list
      const items = reorder(
        board!.columns[sourceColumnIndex].items,
        source.index,
        destination.index
      ) as ColumnItemType[];
      const columns = produce(board!.columns, (draft) => {
        draft[sourceColumnIndex].items = items;
      });
      firebaseUpdateBoard({ ...board!, columns });
    } else {
      // moving around 2 diff columns
      const result = move(
        board!.columns[sourceColumnIndex].items,
        board!.columns[destinationColumnIndex].items,
        source.index,
        destination.index,
        sourceColumnIndex,
        destinationColumnIndex
      );
      const columns = produce(board!.columns, (draft) => {
        draft[sourceColumnIndex].items = result[sourceColumnIndex];
        draft[destinationColumnIndex].items = result[destinationColumnIndex];
      });
      firebaseUpdateBoard({ ...board!, columns });
    }
  }

  return (
    <PageLayout>
      {board === null ? (
        <FullPageLoader />
      ) : (
        <Box>
          {/* <pre>{JSON.stringify(board, null, 2)}</pre> */}
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
                      bg={
                        snapshot.isDraggingOver
                          ? colorMode === "light"
                            ? "gray.200"
                            : "gray.700"
                          : "inherit"
                      }
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

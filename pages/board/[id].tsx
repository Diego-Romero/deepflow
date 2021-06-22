import React, { useEffect, useState } from "react";
import { withAuthUser, AuthAction, useAuthUser } from "next-firebase-auth";
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Tooltip,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import Firebase from "firebase";
import { PageLayout } from "../../components/PageLayout";
import FullPageLoader from "../../components/FullPageLoader";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import produce from "immer";
import { ColumnItem, Board, BoardData, User } from "../../types";
import { move, reorder, reorderList } from "../../utils/util-functions";
import { BoardHeader } from "../../components/BoardHeader";
import { Column } from "../../components/Column";
import { CreateColumnModal } from "../../components/CreateColumnModal";
import {
  BoardSettingsModal,
  BoardSettingsValues,
} from "../../components/BoardSettingsModal";
import { useRouter } from "next/router";
import config from "../../utils/config";
import { AddIcon } from "@chakra-ui/icons";

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
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const UserRef = Firebase.database().ref(
    config.collections.user(authUser.id as string)
  );

  const boardDbRef = Firebase.database().ref(
    config.collections.boardMetadata(authUser.id as string, id as string)
  );
  const boardDataDbRef = Firebase.database().ref(
    config.collections.boardData(id as string)
  );

  const getBoard = () => {
    boardDbRef.on("value", (snapshot) => {
      console.log(snapshot.val())
      setBoard(snapshot.val() as Board);
    });
  };

  const getBoardData = () => {
    boardDataDbRef.on("value", (snapshot) => {
      setBoardData(snapshot.val() as BoardData);
    });
  };

  const getUser = () => {
    UserRef.on("value", (snapshot) => {
      setUser(snapshot.val() as User);
    });
  };

  const firebaseUpdateBoard = (nextBoard: BoardData) => {
    boardDataDbRef.set(nextBoard);
  };

  useEffect(() => {
    getBoard();
    getBoardData();
    getUser();
  }, []);

  const createNewItem = (listIndex: number, name: string) => {
    const newItem: ColumnItem = {
      name,
      createdAt: Date.now(),
      done: false,
      description: "",
    };
    const columns = produce(boardData!.columns, (draft) => {
      const columnItems = boardData!.columns[listIndex].items || [];
      draft[listIndex].items = [...columnItems, newItem];
    });
    firebaseUpdateBoard({ ...boardData!, columns });
  };

  const createNewColumn = (name: string) => {
    const columns = [...boardData!.columns, { name, items: [] }];
    const nextBoard = { ...boardData!, columns };
    firebaseUpdateBoard(nextBoard);
  };

  const deleteColumn = (index: number) => {
    const columns = [...boardData!.columns];
    columns.splice(index, 1);
    firebaseUpdateBoard({ ...boardData!, columns });
  };

  const updateColumn = (name: string, index: number) => {
    const columns = produce(boardData!.columns, (draft) => {
      draft[index].name = name;
    });
    setBoardData({ ...boardData!, columns });
  };

  const updateBoardMetadata = (boardUpdatedData: BoardSettingsValues) => {
    const updatedBoard = { ...boardData!, ...boardUpdatedData };
    firebaseUpdateBoard(updatedBoard);
  };

  const deleteBoard = () => {
    boardDataDbRef.remove();
    router.push(config.routes.dashboard);
  };

  const deleteItem = (columnIndex: number, itemIndex: number) => {
    const updatedBoard = produce(boardData!, (draft) => {
      const items = draft!.columns[columnIndex].items;
      items!.splice(itemIndex, 1);
    });
    firebaseUpdateBoard(updatedBoard);
  };

  const updateItem = (
    columnIndex: number,
    itemIndex: number,
    item: ColumnItem
  ) => {
    const updatedBoard = produce(boardData!, (draft) => {
      draft!.columns[columnIndex].items![itemIndex] = item;
    });
    firebaseUpdateBoard(updatedBoard);
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (result.type === "column") {
      const columns = reorderList(
        boardData!.columns,
        source.index,
        destination.index
      );
      firebaseUpdateBoard({ ...boardData!, columns });
      return;
    }

    const sourceColumnIndex = parseInt(source.droppableId.split("-")[1]); // getting column index with the id
    const destinationColumnIndex = parseInt(
      destination.droppableId.split("-")[1]
    ); // getting column index with the id

    if (source.droppableId === destination.droppableId) {
      // if moving around the same list
      const items = reorder(
        boardData!.columns[sourceColumnIndex].items!,
        source.index,
        destination.index
      ) as ColumnItem[];
      const columns = produce(boardData!.columns, (draft) => {
        draft[sourceColumnIndex].items = items;
      });
      firebaseUpdateBoard({ ...boardData!, columns });
    } else {
      // moving around 2 diff columns
      const result = move(
        boardData!.columns[sourceColumnIndex].items,
        boardData!.columns[destinationColumnIndex].items,
        source.index,
        destination.index,
        sourceColumnIndex,
        destinationColumnIndex
      );
      const columns = produce(boardData!.columns, (draft) => {
        draft[sourceColumnIndex].items = result[sourceColumnIndex];
        draft[destinationColumnIndex].items = result[destinationColumnIndex];
      });
      firebaseUpdateBoard({ ...boardData!, columns });
    }
  }

  return (
    <PageLayout user={user}>
      {boardData === null || board === null ? (
        <FullPageLoader />
      ) : (
        <Box>
          <Box display={[null, "none"]}>
            <Heading mt={8} size="lg" textAlign="center">
              Boards view not available on mobile yet
            </Heading>
          </Box>

          <Box display={["none", "block"]}>
            {/* <pre>{JSON.stringify(board, null, 2)}</pre> */}
            <Flex
              px={8}
              py={8}
              flexDir="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              overflow="auto"
            >
              <BoardHeader
                openSettings={onSettingsOpen}
                board={board!}
                firebaseUpdateBoard={firebaseUpdateBoard}
              />
              <Divider mb={4} />
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
                        p="2"
                        {...provided.droppableProps}
                        alignItems="flex-start"
                        bg={
                          snapshot.isDraggingOver
                            ? colorMode === "light"
                              ? "gray.300"
                              : "gray.700"
                            : "inherit"
                        }
                      >
                        {boardData.columns.map((column, index) => (
                          <Column
                            column={column}
                            columnIndex={index}
                            key={index}
                            createNewItem={createNewItem}
                            deleteColumn={deleteColumn}
                            updateColumn={updateColumn}
                            updateItem={updateItem}
                            deleteItem={deleteItem}
                          />
                        ))}
                        {provided.placeholder}
                        <Tooltip label="Add Row">
                          <IconButton
                            isRound
                            onClick={onOpen}
                            shadow="lg"
                            variant="solid"
                            size="lg"
                            aria-label="Add row"
                            colorScheme="blue"
                            icon={<AddIcon />}
                          />
                        </Tooltip>
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
              boardData={boardData!}
              updateBoard={updateBoardMetadata}
              deleteBoard={deleteBoard}
            />
          </Box>
        </Box>
      )}
    </PageLayout>
  );
};

// todo: insert values at the start

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(BoardPage);

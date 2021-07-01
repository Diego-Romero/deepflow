import React, { useEffect, useState } from 'react';
import { withAuthUser, AuthAction, useAuthUser } from 'next-firebase-auth';
import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Stack,
  Tooltip,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import Firebase from 'firebase';
import { PageLayout } from '../../components/PageLayout';
import FullPageLoader from '../../components/FullPageLoader';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import produce from 'immer';
import { ColumnItem, Board, BoardData, User } from '../../types';
import { move, reorder, reorderList } from '../../utils/util-functions';
import { BoardHeader } from '../../components/BoardHeader';
import { Column } from '../../components/Column';
import { CreateColumnModal } from '../../components/CreateColumnModal';
import { useRouter } from 'next/router';
import config from '../../utils/config';
import { AddIcon } from '@chakra-ui/icons';
import { AiOutlineZoomIn, AiOutlineZoomOut } from 'react-icons/ai';
import { DeleteColumn } from '../../components/DeleteColumn';

const MIN_COL_SIZE = 1,
  MAX_COL_SIZE = 5;

const BoardPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
    boardDbRef.on('value', (snapshot) => {
      setBoard(snapshot.val() as Board);
    });
  };

  const getBoardData = () => {
    boardDataDbRef.on('value', (snapshot) => {
      const val = snapshot.val() || { columns: [] };
      setBoardData(val);
    });
  };

  const getUser = () => {
    UserRef.on('value', (snapshot) => {
      setUser(snapshot.val() as User);
    });
  };

  const updateBoardData = (nextBoard: BoardData) => {
    boardDataDbRef.set(nextBoard);
  };

  const updateBoard = (nextBoard: Board) => {
    boardDbRef.set(nextBoard);
  };

  useEffect(() => {
    getBoard();
    getBoardData();
    getUser();
  }, [id]);

  const createNewItem = (listIndex: number, name: string) => {
    const newItem: ColumnItem = {
      name,
      createdAt: Date.now(),
      done: false,
      description: '',
    };
    const columns = produce(boardData!.columns, (draft) => {
      const columnItems = boardData!.columns[listIndex].items || [];
      draft[listIndex].items = [...columnItems, newItem];
    });
    updateBoardData({ ...boardData!, columns });
  };

  const createNewColumn = (name: string) => {
    const columns = [{ name, items: [] }, ...boardData!.columns];
    const nextBoard = { ...boardData!, columns };
    updateBoardData(nextBoard);
  };

  const deleteColumn = (index: number) => {
    const columns = [...boardData!.columns];
    columns.splice(index, 1);
    updateBoardData({ ...boardData!, columns });
  };

  const updateColumn = (name: string, index: number) => {
    const columns = produce(boardData!.columns, (draft) => {
      draft[index].name = name;
    });
    setBoardData({ ...boardData!, columns });
  };

  const deleteBoard = () => {
    boardDataDbRef.remove();
    boardDbRef.remove();
    router.push(config.routes.dashboard);
  };

  const deleteItem = (columnIndex: number, itemIndex: number) => {
    const updatedBoard = produce(boardData!, (draft) => {
      const items = draft!.columns[columnIndex].items;
      items!.splice(itemIndex, 1);
    });
    updateBoardData(updatedBoard);
  };

  const updateItem = (
    columnIndex: number,
    itemIndex: number,
    item: ColumnItem
  ) => {
    const updatedBoard = produce(boardData!, (draft) => {
      draft!.columns[columnIndex].items![itemIndex] = item;
    });
    updateBoardData(updatedBoard);
  };

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (result.type === 'column') {
      const columns = reorderList(
        boardData!.columns,
        source.index,
        destination.index
      );
      updateBoardData({ ...boardData!, columns });
      return;
    }

    const sourceColumnIndex = parseInt(source.droppableId.split('-')[1]); // getting column index with the id
    const destinationColumnIndex = parseInt(
      destination.droppableId.split('-')[1]
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
      updateBoardData({ ...boardData!, columns });
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
      updateBoardData({ ...boardData!, columns });
    }
  }

  function setColSize(n: number) {
    const newColSize: number = n + (board!.colSize || 3); // if there is no colSize
    if (newColSize >= MIN_COL_SIZE && newColSize <= MAX_COL_SIZE) {
      updateBoard({ ...board!, colSize: newColSize });
    }
  }

  return (
    <PageLayout user={user}>
      {boardData === null || board === null ? (
        <FullPageLoader />
      ) : (
        <Box>
          <Box display={[null, 'none']}>
            <Heading mt={8} size="lg" textAlign="center">
              Boards view not available on mobile yet
            </Heading>
          </Box>

          <Box display={['none', 'block']}>
            {/* <pre>{JSON.stringify(board, null, 2)}</pre> */}
            <Flex
              px={4}
              py={4}
              flexDir="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              overflow="auto"
            >
              <BoardHeader
                board={board!}
                updateBoard={updateBoard}
                deleteBoard={deleteBoard}
              />
              <Divider borderColor="gray.300" />
              <Box>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId="board"
                    direction="horizontal"
                    type="column"
                  >
                    {(provided, snapshot) => (
                      <Flex
                        py={4}
                        borderRadius="md"
                        flexDir="row"
                        ref={provided.innerRef}
                        justifyContent="center"
                        {...provided.droppableProps}
                        alignItems="flex-start"
                        borderColor="gray.300"
                        bgColor={
                          snapshot.isDraggingOver ? 'gray.300' : 'inherit'
                        }
                      >
                        <Stack spacing={2} mr={6}>
                          <Tooltip label="Add Row">
                            <IconButton
                              isRound
                              onClick={onOpen}
                              shadow="lg"
                              // variant="solid"
                              _hover={{ bgColor: 'gray.700' }}
                              bgColor="gray.900"
                              color="white"
                              size="md"
                              aria-label="Add row"
                              icon={<AddIcon />}
                            />
                          </Tooltip>
                          <Tooltip label="Increase column size">
                            <IconButton
                              isRound
                              shadow="md"
                              variant="solid"
                              colorScheme="gray"
                              backgroundColor="white"
                              borderColor="gray.900"
                              color="gray.900"
                              size="md"
                              isDisabled={board.colSize === MAX_COL_SIZE}
                              aria-label="Add row"
                              onClick={() => setColSize(1)}
                              icon={<AiOutlineZoomIn />}
                            />
                          </Tooltip>
                          <Tooltip label="Decrease column size">
                            <IconButton
                              isRound
                              shadow="md"
                              variant="solid"
                              colorScheme="gray"
                              backgroundColor="white"
                              borderColor="gray.900"
                              color="gray.900"
                              isDisabled={board.colSize === MIN_COL_SIZE}
                              size="md"
                              aria-label="Add row"
                              onClick={() => setColSize(-1)}
                              icon={<AiOutlineZoomOut />}
                            />
                          </Tooltip>
                        </Stack>
                        {boardData.columns.map((column, index) => (
                          <Column
                            columnSize={board.colSize || 3}
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
                        {/* <DeleteColumn columnIndex={boardData.columns.length} /> */}
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
          </Box>
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

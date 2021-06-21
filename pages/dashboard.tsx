import React, { useEffect, useState } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import Firebase from "firebase";
import FullPageLoader from "../components/FullPageLoader";
import { PageLayout } from "../components/PageLayout";
import { Card } from "../components/Card";
import {
  Box,
  Flex,
  Text,
  Heading,
  IconButton,
  Divider,
  useColorMode,
  Button,
  useDisclosure,
  CircularProgress,
} from "@chakra-ui/react";
import { BoardType, ColumnType } from "../types";
import { useRouter } from "next/router";
import { IoMdArrowForward } from "react-icons/io";
import {
  CreateBoardModal,
  TemplateTypes,
} from "../components/CreateBoardModal";
import { Fragment } from "react";
import { createTemplateColumns } from "../utils/util-functions";

interface Board {
  name: string;
  columns: ColumnType[];
  workInterval: number;
  shortRestTime: number;
  longRestTime: number;
  longBreakAfter: number;
  targetPerDay: number;
  timerEndTime: number;
  pomodoroCount: number;
  onShortBreak: boolean;
  onLongBreak: boolean;
  isTimerPlaying: boolean;
}

type FirebaseBoards = {
  [id: string]: Board;
};

const mapBoardsFromFirebase = (values: FirebaseBoards): BoardType[] => {
  const nextBoards: BoardType[] = [];
  for (let [id, value] of Object.entries(values)) {
    nextBoards.push({ id, ...value });
  }
  return nextBoards;
};

const DashboardPage = () => {
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  const router = useRouter();
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const { colorMode } = useColorMode();
  const authUser = useAuthUser();
  const dbPath = `/users/${authUser.id}/boards`;
  const boardsRef = Firebase.database().ref(dbPath);

  const createBoard = (name: string, template: TemplateTypes) => {
    const newBoard: Board = {
      name,
      columns: createTemplateColumns(template),
      workInterval: 25,
      shortRestTime: 5,
      longRestTime: 30,
      longBreakAfter: 4,
      targetPerDay: 10,
      timerEndTime: 0,
      pomodoroCount: 0,
      onShortBreak: false,
      onLongBreak: false,
      isTimerPlaying: false,
    };
    boardsRef.push(newBoard);
  };

  const getBoards = () => {
    boardsRef.on("value", (snapshot) => {
      if (snapshot.val()) {
        const nextBoards = mapBoardsFromFirebase(
          snapshot.val() as FirebaseBoards
        );
        setBoards(nextBoards);
      } else setBoards([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    getBoards();
  }, []);

  return (
    <PageLayout>
      <Flex justifyContent="center">
        <Box
          width={["100%", "100%", "container.sm"]}
          px={[4, null, 8]}
          py={[8, 8, 12]}
        >
          <Card>
            <Heading size="lg" mb={4}>
              Your boards
            </Heading>
            {loading ? (
              <Flex justifyContent="center" alignItems="center">
                <Box>
                  <CircularProgress isIndeterminate color="purple.500" />
                  <Text>Loading</Text>
                </Box>
              </Flex>
            ) : (
              <Box>
                <Flex flexDirection="column">
                  {boards.length === 0 ? (
                    <Text>You do not have any boards</Text>
                  ) : (
                    <Fragment>
                      {boards.map((board) => (
                        <Box key={board.id}>
                          <Flex
                            p={2}
                            cursor="pointer"
                            key={board.id}
                            alignItems="center"
                            _hover={{
                              backgroundColor:
                                colorMode === "light" ? "gray.100" : "gray.900",
                            }}
                            justifyContent="space-between"
                            onClick={() => router.push(`/board/${board.id}`)}
                          >
                            <Text fontSize="lg" noOfLines={1} isTruncated>
                              {board.name}
                            </Text>
                            <IconButton
                              colorScheme="purple"
                              isRound
                              variant="ghost"
                              aria-label="Navigate to board"
                              icon={<IoMdArrowForward />}
                            />
                          </Flex>
                          <Divider />
                        </Box>
                      ))}
                    </Fragment>
                  )}
                </Flex>
                <Button
                  mt={8}
                  isFullWidth
                  bgGradient="linear(to-r, cyan.700,purple.500)"
                  _hover={{
                    bgGradient: "linear(to-r, cyan.600,purple.400)",
                  }}
                  onClick={onCreateModalOpen}
                  color="white"
                >
                  Create Board
                </Button>
              </Box>
            )}
          </Card>
        </Box>
      </Flex>
      <CreateBoardModal
        modalOpen={isCreateModalOpen}
        modalClose={onCreateModalClose}
        createBoard={createBoard}
      />
    </PageLayout>
  );
};

// todo: set a SSR to fetch the initial lists?
// todo: test against fetching the lists on the client side

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(DashboardPage);

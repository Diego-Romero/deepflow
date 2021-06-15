import React, { useEffect, useState } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import Firebase from "firebase";
import { v4 as uuidv4 } from "uuid";
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
import { BoardType } from "../types";
import { useRouter } from "next/router";
import { IoMdArrowForward } from "react-icons/io";
import { CreateBoardModal } from "../components/CreateBoardModal";

type FirebaseBoards = {
  [id: string]: { name: string };
};

const mapBoardsFromFirebase = (values: FirebaseBoards): BoardType[] => {
  const nextBoards: BoardType[] = [];
  for (let [id, value] of Object.entries(values)) {
    nextBoards.push({ id, ...value });
  }
  return nextBoards;
};

const BoardsPage = () => {
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
  const dbPath = `/${authUser.id}/boards`;

  const createBoard = (name: string) => {
    const boardsRef = Firebase.database().ref(dbPath);
    boardsRef.push({
      name,
    });
  };

  const getBoards = () => {
    const boardsRef = Firebase.database().ref(dbPath);
    boardsRef.on("value", (snapshot) => {
      const nextBoards = mapBoardsFromFirebase(
        snapshot.val() as FirebaseBoards
      );
      setBoards(nextBoards);
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
                  {boards.map((board) => (
                    <Box>
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
})(BoardsPage);

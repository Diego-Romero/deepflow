import {
  Heading,
  Text,
  Flex,
  Box,
  CircularProgress,
  IconButton,
  Divider,
  Button,
	useDisclosure,
} from '@chakra-ui/react';
import router from 'next/router';
import React, { Fragment } from 'react';
import { IoMdArrowForward } from 'react-icons/io';
import { BoardWithId } from '../utils/util-functions';
import { Card } from './Card';
import { CreateBoardModal } from './CreateBoardModal';

interface Props {
  loading: boolean;
  boards: BoardWithId[];
}

export const BoardsCard: React.FC<Props> = (props) => {
  const { loading, boards } = props;
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();
  return (
    <Card>
      <Heading size="md" mb={4}>
        Boards
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
                        backgroundColor: 'gray.100',
                      }}
                      justifyContent="space-between"
                      onClick={() => router.push(`/board/${board.id}`)}
                    >
                      <Text noOfLines={1} isTruncated>
                        {board.name}
                      </Text>
                      <IconButton
                        colorScheme="purple"
                        isRound
                        size="sm"
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
            mt={4}
            isFullWidth
            bgGradient="linear(to-r, cyan.700,purple.500)"
            _hover={{
              bgGradient: 'linear(to-r, cyan.600,purple.400)',
            }}
            onClick={onCreateModalOpen}
            size="sm"
            color="white"
          >
            New
          </Button>
        </Box>
      )}
      <CreateBoardModal
        modalOpen={isCreateModalOpen}
        modalClose={onCreateModalClose}
      />
    </Card>
  );
};

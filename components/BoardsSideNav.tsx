import {
  Drawer,
  Text,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Stack,
  Flex,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { IoMdArrowForward } from 'react-icons/io';
import { BoardWithId } from '../utils/util-functions';
import { useRouter } from 'next/router';
import config from '../utils/config';
import { CreateBoardModal } from './CreateBoardModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boards: BoardWithId[];
}

export const BoardsSideNav: React.FC<Props> = (props) => {
  const { isOpen, onClose, boards } = props;
  const router = useRouter();
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onClose: onCreateModalClose,
  } = useDisclosure();

  const navigateToBoard = (id: string) => {
    router.push(config.routes.goToBoard(id));
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>boards</DrawerHeader>

        <DrawerBody>
          <Flex flexDir="column">
            {boards.map((board) => (
              <Flex
                key={board.id}
                flexDir="row"
                py={4}
                px={2}
                borderBottomWidth="1px"
                alignItems="center"
                cursor="pointer"
                justifyContent="space-between"
                _hover={{
                  bgColor: 'gray.100',
                }}
                onClick={() => navigateToBoard(board.id)}
              >
                <Text fontSize="large">{board.name}</Text>
                <IconButton
                  colorScheme="blue"
                  isRound
                  variant="ghost"
                  aria-label="Navigate to board"
                  icon={<IoMdArrowForward />}
                />
              </Flex>
            ))}
          </Flex>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={onCreateModalOpen}>
            Create board
          </Button>
        </DrawerFooter>
      </DrawerContent>

      <CreateBoardModal
        modalOpen={isCreateModalOpen}
        modalClose={onCreateModalClose}
      />
    </Drawer>
  );
};

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
} from '@chakra-ui/react';
import React from 'react';
import { IoMdArrowForward } from 'react-icons/io';
import { BoardWithId } from '../utils/util-functions';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  boards: BoardWithId[];
}

export const BoardsSideNav: React.FC<Props> = (props) => {
  const { isOpen, onClose, boards } = props;

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
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
                  bgColor: "gray.100"
                }}
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

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

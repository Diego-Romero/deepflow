import {
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { IoMdHome, IoMdLogOut } from 'react-icons/io';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import config from '../../../utils/config';
import { User } from '../../../types';
import { Timer } from './Timer';
import { HamburgerIcon } from '@chakra-ui/icons';
import { TodosSideNav } from '../sidenav/TodosSideNav';
import { BsGraphUp, BsInfoCircle, BsKanban, BsListCheck } from 'react-icons/bs';

interface Props {
  user: User | null;
}

export const NavBar: React.FC<Props> = (props) => {
  const { user } = props;
  const router = useRouter();
  const AuthUser = useAuthUser();
  const {
    isOpen: isTodosOpen,
    onOpen: onTodosOpen,
    onClose: onTodosClose,
  } = useDisclosure();

  return (
    <Flex
      direction="row"
      color="white"
      bgColor="gray.900"
      px={2}
      py={3}
      align="center"
      justify="space-between"
    >
      <HStack spacing={4}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="ghost"
            fontSize="xl"
          />
          <MenuList color="gray.900" fontSize="md" bgColor="white">
            {AuthUser.email ? (
              <>
                <MenuItem
                  icon={<BsGraphUp />}
                  onClick={() => router.push(config.routes.dashboard)}
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  icon={<BsKanban />}
                  // isDisabled
                  display={['none', null, 'flex']}
                >
                  Boards
                </MenuItem>
                <MenuItem onClick={onTodosOpen} icon={<BsListCheck />}>
                  Todos
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<IoMdLogOut />} onClick={AuthUser.signOut}>
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  icon={<IoMdHome />}
                  onClick={() => router.push(config.routes.home)}
                >
                  Home
                </MenuItem>
              </>
            )}
            <MenuItem
              icon={<BsInfoCircle />}
              bgColor="white"
              onClick={() => router.push('/about')}
            >
              About
            </MenuItem>
          </MenuList>
        </Menu>
        {router.route === `/board/[id]` ? (
          <Button
            colorScheme="whiteAlpha"
            size="xs"
            onClick={() => router.push(config.routes.dashboard)}
          >
            Back
          </Button>
        ) : null}
      </HStack>
      <HStack spacing={4}>
        {user !== null ? <Timer user={user} /> : null}
      </HStack>
      {AuthUser.email ? (
        <>
          <TodosSideNav isOpen={isTodosOpen} onClose={onTodosClose} />
        </>
      ) : null}
    </Flex>
  );
};

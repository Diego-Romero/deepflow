import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import * as React from 'react';
import { IoMdHome, IoMdLogIn, IoMdLogOut } from 'react-icons/io';
import { useAuthUser } from 'next-firebase-auth';
import { useRouter } from 'next/router';
import config from '../utils/config';
import { User } from '../types';
import { Timer } from './Timer';
import { HamburgerIcon } from '@chakra-ui/icons';

interface Props {
  user: User | null;
}

export const NavBar: React.FC<Props> = (props) => {
  const { user } = props;
  const router = useRouter();
  const AuthUser = useAuthUser();

  return (
    <Flex
      direction="row"
      color="white"
      bgColor="gray.900"
      px={4}
      py={3}
      align="center"
      justify="space-between"
    >
      <HStack spacing={2}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="ghost"
            fontSize="xl"
          />
          <MenuList color="gray.900" fontSize="md">
            {AuthUser.email ? (
              <>
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
                <MenuItem
                  icon={<IoMdLogIn />}
                  onClick={() => router.push(config.routes.auth)}
                >
                  Login / Register
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
        <Badge fontSize="sm" variant="subtle" colorScheme="green">
          Beta
        </Badge>
      </HStack>
      <HStack>{user !== null ? <Timer user={user} /> : null}</HStack>
    </Flex>
  );
};

import {
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
      bgGradient="linear(to-r, cyan.700,purple.500)"
      p={4}
      align="center"
      justify="space-between"
    >
      <HStack spacing={2}>
        {/* <Breadcrumb fontWeight="bold" fontSize="xl" separator="-">
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Boards</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">Todos</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb> */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="ghost"
            fontSize="xl"
          />
          <MenuList color="gray.900" fontSize="lg">
            {AuthUser.email ? (
              <>
                <MenuItem icon={<IoMdLogOut />} onClick={AuthUser.signOut}>
                  Logout
                </MenuItem>
              </>
            ) : (
              <>
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
        {!AuthUser.email ? (
          <>
            <IconButton
              size="md"
              variant="ghost"
              color="current"
              fontSize="2xl"
              icon={<IoMdHome />}
              onClick={() => router.push('/')}
              aria-label={`Home`}
            />
          </>
        ) : null}
      </HStack>
      {user !== null ? <Timer user={user} /> : null}
    </Flex>
  );
};

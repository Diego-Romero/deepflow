import React, { useEffect } from 'react';
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { PageLayout } from '../components/PageLayout';
import { Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import config from '../utils/config';

const LandingPage = () => {
  const AuthUser = useAuthUser();
  const router = useRouter();

  return (
    <PageLayout user={null}>
      <Flex
        mt={12}
        alignItems="center"
        justifyContent="flex-start"
        flexDir="column"
      >
        <Heading mb={8}>Deepflow</Heading>
        {!AuthUser.email ? (
          <Stack spacing={0}>
            <Button
              colorScheme="purple"
              size="lg"
              mb={4}
              color="white"
              bgGradient="linear(to-r, cyan.700,purple.500)"
              _hover={{
                bgGradient: 'linear(to-r, cyan.600,purple.400)',
              }}
              onClick={() => {
                router.push(config.routes.auth);
              }}
            >
              Login / Register
            </Button>
          </Stack>
        ) : (
          <Button
            size="lg"
            color="white"
            bgGradient="linear(to-r, cyan.700,purple.500)"
            _hover={{
              bgGradient: 'linear(to-r, cyan.600,purple.400)',
            }}
            onClick={() => router.push(config.routes.dashboard)}
            mb={4}
          >
            Boards
          </Button>
        )}
      </Flex>
    </PageLayout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  // whenAuthed: AuthAction.REDIRECT_TO_APP,
  // appPageURL: config.routes.dashboard,
})(LandingPage);

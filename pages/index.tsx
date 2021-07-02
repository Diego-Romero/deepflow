import React, { useEffect } from 'react';
import {
  AuthAction,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import { Badge, Box, Flex, Grid, Heading, Link, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import config from '../utils/config';
import Particles from 'react-tsparticles';
import { particlesConfig } from '../components/ui/particlesConfig';
import { LoggedOutLayout } from '../components/layouts/LoggedOutLayout';
import FirebaseAuth from '../components/FirebaseAuth';

const LandingPage = () => {
  const router = useRouter();
  const authUser = useAuthUser();
  useEffect(() => {
    if (authUser) authUser.signOut();
  }, []);

  return (
    <LoggedOutLayout>
      <Flex
        position="relative"
        height={'85vh'}
        width="100vw"
        justifyContent="center"
        alignItems={'center'}
      >
        <Stack
          spacing={6}
          textAlign="center"
          color="white"
          justifyContent="center"
          alignItems="center"
          bgColor="transparent"
        >
          <Heading size="4xl">Deepflow</Heading>
          <Heading size="xl">
            The app to keep you{' '}
            <Link
              isExternal
              href="https://blog.doist.com/deep-work/"
              textDecor="underline"
            >
              focused
            </Link>
          </Heading>
          <Link
            fontSize="xl"
            onClick={() => router.push(config.routes.about)}
            textDecor="underline"
          >
            Want to know more?
          </Link>
          <FirebaseAuth />
          <Link
            textDecor="underline"
            isExternal
            fontSize="sm"
            href="https://www.linkedin.com/in/dev-diego-romero/"
          >
            Made by Diego Romero
          </Link>
          <Badge fontSize="xs" variant="subtle" colorScheme="green">
            Beta
          </Badge>
        </Stack>
        <Box
          position="absolute"
          top="0"
          left="0"
          height={['100vh']}
          width="100%"
          bgColor="black"
          zIndex="-1"
        >
          <Particles
            id="particles"
            init={() => {}}
            loaded={() => {}}
            // @ts-ignore
            options={particlesConfig}
          />
        </Box>
      </Flex>
      <Grid></Grid>
    </LoggedOutLayout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
})();

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  appPageURL: config.routes.dashboard,
})(LandingPage);

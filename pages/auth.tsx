import React from 'react';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
import FirebaseAuth from '../components/FirebaseAuth';
import { PageLayout } from '../components/PageLayout';
import { Card } from '../components/Card';
import { Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Auth = () => {
  const router = useRouter();
  return (
    <PageLayout user={null}>
      <Flex alignItems="flex-start" justifyContent="center" mt={12}>
        <Card>
          <Stack spacing="4" textAlign="center">
            <Heading size="md">Login / Register</Heading>
            <FirebaseAuth />
            {/* <Button
              colorScheme="gray"
              size="sm"
              onClick={() => router.push('/')}
            >
              Back to home
            </Button> */}
          </Stack>
        </Card>
      </Flex>
    </PageLayout>
  );
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);

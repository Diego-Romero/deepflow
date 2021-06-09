import React from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import FirebaseAuth from "../components/FirebaseAuth";
import { PageLayout } from "../components/PageLayout";
import { Card } from "../components/Card";
import { Flex, Heading, Stack } from "@chakra-ui/react";

const Auth = () => (
  <PageLayout>
    <Flex alignItems="flex-start" justifyContent="center" mt={12}>
      <Card>
        <Stack spacing="4" textAlign="center">
          <Heading size="md">Login / Register</Heading>
          <FirebaseAuth />
        </Stack>
      </Card>
    </Flex>
  </PageLayout>
);

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);

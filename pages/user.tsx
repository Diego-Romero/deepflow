import React from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import FullPageLoader from "../components/FullPageLoader";
import { PageLayout } from "../components/PageLayout";
import { Card } from "../components/Card";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import config from "../utils/config";

const DashboardPage = () => {
  const authUser = useAuthUser();
  const logoutUser = () => {
    authUser.signOut();
  };

  return (
    <PageLayout>
      <Flex justifyContent="center">
        <Box px={[4, null, 8]} py={[8, 8, 12]}>
          <Card>
            <Flex flexDir="column" alignItems="center" justifyContent="center">
              <Heading size="lg" mb={4}>
                {authUser.displayName}
              </Heading>
              <Avatar
                src={authUser.photoURL as string}
                name="user"
                size="2xl"
              />
              <Stack mt={4} spacing={4}>
                <Text>Email: {authUser.email}</Text>
                <Button onClick={logoutUser}>Sign out</Button>
              </Stack>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </PageLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(DashboardPage);

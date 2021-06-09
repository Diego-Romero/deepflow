import React from "react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import { PageLayout } from "../components/PageLayout";
import { Button, Flex, Heading, Stack, useDisclosure } from "@chakra-ui/react";
import { LoginModal } from "../components/LoginModal";
import { useRouter } from "next/router";

const LandingPage = () => {
  const AuthUser = useAuthUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <PageLayout>
      <Flex
        mt={12}
        alignItems="center"
        justifyContent="flex-start"
        flexDir="column"
      >
        <Heading mb={8}>Deepflow</Heading>
        {!AuthUser.email ? (
          <Stack spacing={0} >
            <Button
              colorScheme="purple"
              size="lg"
              mb={4}
              color="white"
              bgGradient="linear(to-r, cyan.700,purple.500)"
              _hover={{
                bgGradient: "linear(to-r, cyan.600,purple.400)",
              }}
              // onClick={onOpen}
              onClick={() => router.push("/auth")}
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
              bgGradient: "linear(to-r, cyan.600,purple.400)",
            }}
            onClick={() => router.push("/boards")}
            mb={4}
          >
            Boards
          </Button>
        )}
      </Flex>
      <LoginModal modalOpen={isOpen} modalClose={onClose} />
    </PageLayout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(LandingPage);

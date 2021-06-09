import React from "react";
import { withAuthUser, withAuthUserTokenSSR } from "next-firebase-auth";
import { PageLayout } from "../components/PageLayout";
import { Flex, Heading } from "@chakra-ui/react";

const LandingPage = () => {
  return (
    <PageLayout>
      <Flex mt={12}>
        <Heading>Deepflow</Heading>
      </Flex>
    </PageLayout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(LandingPage);

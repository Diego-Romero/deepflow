import React from "react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import Header from "../components/Header";
import DemoPageLinks from "../components/DemoPageLinks";
import { PageLayout } from "../components/PageLayout";

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
};

const DemoLandingPage = () => {
  const AuthUser = useAuthUser();
  return (
    <PageLayout user={null}>
      {/* <Header email={AuthUser.email} signOut={AuthUser.signOut} /> */}
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <h3>Home</h3>
          <p>
            This page does not require authentication, so it won't redirect to
            the login page if you are not signed in.
          </p>
          <p>
            If you remove `getServerSideProps` from this page, it will be static
            and load the authed user only on the client side.
          </p>
        </div>
        <DemoPageLinks />
      </div>
    </PageLayout>
  );
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(DemoLandingPage);

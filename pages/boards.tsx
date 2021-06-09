import React from "react";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import getAbsoluteURL from "../utils/getAbsoluteURL";

const BoardsPage = ({ favoriteColor }) => {
  console.log(favoriteColor)
  const AuthUser = useAuthUser();
  return (
    <div>
      boards page
    </div>
  );
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, req }) => {
  // Optionally, get other props.
  const token = await AuthUser.getIdToken();
  const endpoint = getAbsoluteURL("/api/example", req);
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: token || "unauthenticated",
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      `Data fetching failed with status ${response.status}: ${JSON.stringify(
        data
      )}`
    );
  }
  return {
    props: {
      favoriteColor: data.favoriteColor,
    },
  };
});

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(BoardsPage);

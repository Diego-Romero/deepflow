import React, { useCallback, useEffect, useState } from "react";
import { useAuthUser, withAuthUser, AuthAction } from "next-firebase-auth";
import FullPageLoader from "../components/FullPageLoader";
import { PageLayout } from "../components/PageLayout";
import { Card } from "../components/Card";
import { Heading } from "@chakra-ui/react";
import { getAbsoluteURL } from "../utils/util-functions";

const BoardsPage = () => {
  const AuthUser = useAuthUser(); 

  const [favoriteColor, setFavoriteColor] = useState();
  const fetchData = useCallback(async () => {
    const token = (await AuthUser.getIdToken()) as string;
    const endpoint = getAbsoluteURL("/api/example");
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.error(
        `Data fetching failed with status ${response.status}: ${JSON.stringify(
          data
        )}`
      );
      return null;
    }
    return data;
  }, [AuthUser]);

  useEffect(() => {
    const fetchFavoriteColor = async () => {
      const data = await fetchData();
      setFavoriteColor(data ? data.favoriteColor : "unknown :(");
    };
    fetchFavoriteColor();
  }, [fetchData]);

  return (
    <PageLayout>
      <Card>
        <Heading>boards bro</Heading>
        <div>favorite color: ${favoriteColor}</div>
      </Card>
    </PageLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(BoardsPage);

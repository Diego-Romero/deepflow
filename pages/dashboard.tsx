import React, { useEffect, useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Firebase from 'firebase';
import FullPageLoader from '../components/FullPageLoader';
import { PageLayout } from '../components/PageLayout';
import { Card } from '../components/Card';
import { Flex, Heading, Text, Grid, Stack } from '@chakra-ui/react';
import { User, UserWorkedTime, WorkedTimeWithDate } from '../types';
import {
  BoardWithId,
  mapBoardsFromFirebase,
  mapWorkedTimesToIncDate,
} from '../utils/util-functions';
import config from '../utils/config';
import { BoardsCard } from '../components/BoardsCard';
import { WorkedTimesCard } from '../components/WorkedTimesCard';
import { TodosCard } from '../components/TodosCard';

const DashboardPage = () => {
  const [boards, setBoards] = useState<BoardWithId[]>([]);
  const [workedTimes, setWorkedTimes] = useState<WorkedTimeWithDate[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const authUser = useAuthUser();
  const [user, setUser] = useState<User | null>(null);

  const UserRef = Firebase.database().ref(
    config.collections.user(authUser.id as string)
  );

  const workedTimeRef = Firebase.database().ref(
    config.collections.userWorkedTimes(authUser.id as string)
  );

  useEffect(() => {
    getUser();
    getWorkedTimes();
  }, []);

  const getUser = () => {
    UserRef.on('value', (snapshot) => {
      if (snapshot.val()) {
        const user = snapshot.val() as User;
        setUser(user);
        if (user.boards) setBoards(mapBoardsFromFirebase(user.boards));
        setBoardsLoading(false);
      }
    });
  };

  const getWorkedTimes = () => {
    workedTimeRef.on('value', (snapshot) => {
      const workedTime = snapshot.val() as UserWorkedTime;
      if (workedTime) {
        const withDate = mapWorkedTimesToIncDate(workedTime);
        setWorkedTimes(withDate);
      }
      setRecordsLoading(false);
    });
  };

  return (
    <PageLayout user={user}>
      <Flex justifyContent="center">
        <Grid
          my={8}
          gridGap={6}
          width="container.lg"
          gridTemplateColumns="1fr 2fr"
          gridTemplateRows="auto"
        >
          <Stack spacing={6}>
            <BoardsCard loading={boardsLoading} boards={boards} />
            <TodosCard />
          </Stack>
          <Stack spacing={6}>
            <Card>
              <Heading size="md">Today work intention</Heading>
              <Text py={20}>To be implemeted</Text>
            </Card>
            <WorkedTimesCard
              workedTimes={workedTimes}
              loading={recordsLoading}
            />
          </Stack>
        </Grid>
      </Flex>
    </PageLayout>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(DashboardPage);

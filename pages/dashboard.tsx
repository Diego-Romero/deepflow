import React, { useEffect, useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Firebase from 'firebase';
import FullPageLoader from '../components/FullPageLoader';
import { PageLayout } from '../components/PageLayout';
import { Flex, Grid, Stack } from '@chakra-ui/react';
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
import { IntentionCard } from '../components/IntentionCard';

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
          gridGap={5}
          width={[
            null,
            'container.sm',
            'container.md',
            'container.lg',
            'container.xl',
          ]}
          gridTemplateColumns={[null, null, null, '1.5fr 1fr', '1.2fr 2fr 1fr']}
          gridTemplateRows="auto"
        >
          <Stack spacing={6} display={['none', 'none', 'none', 'none', 'flex']}>
            <BoardsCard loading={boardsLoading} boards={boards} />
            <TodosCard />
          </Stack>
          <IntentionCard />
          <WorkedTimesCard workedTimes={workedTimes} loading={recordsLoading} />
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

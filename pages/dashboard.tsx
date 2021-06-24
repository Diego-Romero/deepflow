import React, { useEffect, useState } from 'react';
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth';
import Firebase from 'firebase';
import FullPageLoader from '../components/FullPageLoader';
import { PageLayout } from '../components/PageLayout';
import { Card } from '../components/Card';
import {
  Box,
  Flex,
  Heading,
  Grid,
  Stack,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
import { User, UserWorkedTime, WorkedTimeWithDate } from '../types';
import {
  BoardWithId,
  mapBoardsFromFirebase,
  mapWorkedTimesToIncDate,
} from '../utils/util-functions';
import config from '../utils/config';
import { BoardsCard } from '../components/BoardsCard';

// const mockWorkedTime: UserWorkedTime = {
//   '23-06-2021': { count: 10, worked: 250 },
//   '22-06-2021': { count: 12, worked: 250 },
//   '21-06-2021': { count: 10, worked: 250 },
//   '20-06-2021': { count: 14, worked: 250 },
//   '19-06-2021': { count: 8, worked: 250 },
//   '18-06-2021': { count: 10, worked: 250 },
//   '17-06-2021': { count: 8, worked: 250 },
// };

const DashboardPage = () => {
  const [boards, setBoards] = useState<BoardWithId[]>([]);
  const [workedTimes, setWorkedTimes] = useState<WorkedTimeWithDate[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(true);
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
      const withDate = mapWorkedTimesToIncDate(workedTime);
      console.log(withDate);
      setWorkedTimes(withDate);
      // console.log('worked time', workedTime);
      // if (!workedTime) {
      //   workedTimeRef.set(mockWorkedTime);
      // }
    });
  };

  return (
    <PageLayout user={user}>
      <Flex justifyContent="center">
        <Grid
          my={8}
          gridGap={8}
          width="container.md"
          gridTemplateColumns="1fr 1fr"
          gridTemplateRows="auto"
        >
          <Stack spacing={4}>
            <BoardsCard loading={boardsLoading} boards={boards} />
            <Card>
              <Heading size="md" mb={4}>
                Todos
              </Heading>
            </Card>
          </Stack>
          <Card maxHeight="80vh">
            <Heading size="md" mb={4}>
              Work Records
            </Heading>
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton px={0} py={2}>
                    <Box flex="1" textAlign="left">
                      Section 1 title
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} px={0}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Card>
        </Grid>
      </Flex>
    </PageLayout>
  );
};

// todo: set a SSR to fetch the initial lists?
// todo: test against fetching the lists on the client side

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: FullPageLoader,
})(DashboardPage);

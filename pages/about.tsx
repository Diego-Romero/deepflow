import React from 'react';
import { withAuthUser } from 'next-firebase-auth';
import Image from 'next/image';
import { Card } from '../components/ui/Card';
import {
  Box,
  Text,
  Button,
  Flex,
  Grid,
  Heading,
  Stack,
  Link,
  Divider,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { LoggedOutLayout } from '../components/layouts/LoggedOutLayout';
import config from '../utils/config';
import YouTube from 'react-youtube';

const CardWithImageContent: React.FC<{ imageUrl: string }> = (props) => {
  const { children, imageUrl } = props;

  return (
    <Stack spacing={8}>
      <Grid
        gridTemplateRows={['auto auto', null, '1fr']}
        gridTemplateColumns={['1fr', null, '1fr 1fr', '1.5fr 2fr']}
        gridColumnGap="8"
      >
        <Card>{children}</Card>
        <Box position="relative" boxSize={['300px', '400px', 'auto']}>
          <Image src={imageUrl} alt="image" layout="fill" />
        </Box>
      </Grid>
      <Divider />
    </Stack>
  );
};
const youtubeOptions = {
  // height: '390',
  // width: '640',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    // autoplay: 1,
  },
};

const About = () => {
  const router = useRouter();
  return (
    <LoggedOutLayout>
      <Flex
        alignItems="flex-start"
        justifyContent="center"
        bgColor="white"
        px={5}
        py={12}
      >
        <Stack maxW="container.lg" spacing={['14']}>
          <CardWithImageContent imageUrl="/images/goals.svg">
            <Stack spacing={6} textAlign="left">
              <Heading size="lg">Why Deepflow?</Heading>
              <Text>
                Deepflow is a software research project whose focus is to find
                out whether it is possible to help the user achieve more and
                better periods of{' '}
                <Link
                  textDecor="underline"
                  href="https://blog.doist.com/deep-work/"
                  isExternal
                >
                  Deep Work
                </Link>
                .
              </Text>
              <Text>
                Renowned author and Computer Science professor Cal Newport
                coined the term Deep Work in a 2012{' '}
                <Link
                  isExternal
                  textDecor="underline"
                  href="https://www.calnewport.com/blog/2012/11/21/knowledge-workers-are-bad-at-working-and-heres-what-to-do-about-it/"
                >
                  blog post
                </Link>
                , then expanded upon in his 2016 best selling book{' '}
                <Link
                  isExternal
                  textDecor="underline"
                  href="https://www.amazon.com/Deep-Work-Focused-Success-Distracted/dp/1455586692"
                >
                  Deep Work
                </Link>
                . Newport's definition of Deep Work is: <br />
              </Text>
              <Text as="cite" borderLeftWidth={3} pl={2}>
                "Professional activity performed in a state of distraction-free
                concentration that pushes your cognitive capabilities to their
                limit. These efforts create new value, improve your skill, and
                are hard to replicate."
              </Text>
            </Stack>
          </CardWithImageContent>

          <Stack spacing={8}>
            <Grid
              gridTemplateRows={['auto auto', null, '1fr']}
              gridTemplateColumns={['1fr', null, '1fr 1fr', '2fr 1fr']}
              gridColumnGap="8"
            >
              <Box position="relative" display={['none', null, null, 'block']}>
                <YouTube
                  videoId="A3RsoN5fAz4"
                  opts={youtubeOptions}
                  onReady={(e) => null}
                />
              </Box>

              <Box
                position="relative"
                display={['block', null, null, 'none']}
                boxSize={['300px', '400px', 'auto']}
              >
                <Image src={'/images/coding.svg'} alt="image" layout="fill" />
              </Box>
              <Stack spacing={4}>
                <Heading size="lg"> How does it works?</Heading>
                <Text>
                  Deepflow is a tool that helps you track your focused time and
                  allows you to organise your tasks and todo's.
                </Text>
                <Text>
                  <Link
                    textDecor="underline"
                    href="https://www.youtube.com/watch?v=A3RsoN5fAz4"
                    isExternal
                  >
                    Watch Demo on Youtube
                  </Link>
                </Text>
              </Stack>
            </Grid>
            <Divider />
          </Stack>

          <CardWithImageContent imageUrl="/images/progress_tracking.svg">
            <Stack spacing={6} textAlign="left">
              <Heading size="lg">Where is it heading?</Heading>
              <Text>
                Currently, I'm collecting user feedback and elaborating a
                roadmap for the future. But the main priorities for this beta
                version are:
              </Text>
              <UnorderedList pl={4}>
                <ListItem color="gray.600" textDecor="line-through">
                  First, allow the user to submit a status/reflection when the
                  timer ends. Past work records will include this information.
                </ListItem>
                <ListItem>
                  Secondly, elaborate on the reporting of previous work records.
                  Users would like to quantify their work and know if they are
                  under or overworking, i.e., how many
                  <Link
                    textDecor="underline"
                    isExternal
                    href="https://todoist.com/productivity-methods/pomodoro-technique"
                  >
                    Pomodoros
                  </Link>
                  are they averaging per week compared to other weeks.
                </ListItem>
                <ListItem>
                  Thirdly, make adding and updating todos a more comprehensive
                  process.{' '}
                </ListItem>
                <ListItem>
                  Lastly, have a template/s to set the daily intention and
                  goals.
                </ListItem>
              </UnorderedList>
            </Stack>
          </CardWithImageContent>
          <CardWithImageContent imageUrl="/images/dev_focus.svg">
            <Stack spacing={6} textAlign="left">
              <Heading size="lg">Are you interested?</Heading>
              <Text>
                Deepflow is currently a non-profit/open-source project, and
                please let me know if you would be interested in collaborating.
                I'm in the looks for:
              </Text>
              <UnorderedList pl={4}>
                <ListItem>Graphic Designer</ListItem>
                <ListItem>Product Manager</ListItem>
                <ListItem>User Experience Expert (UX)</ListItem>
              </UnorderedList>
            </Stack>
          </CardWithImageContent>
          <Flex alignItems="center" justifyContent="center">
            <Button onClick={() => router.push(config.routes.home)}>
              Back to home
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </LoggedOutLayout>
  );
};

export default withAuthUser({
  // whenAuthed: AuthAction.REDIRECT_TO_APP,
  // whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  // whenUnauthedAfterInit: AuthAction.RENDER,
})(About);

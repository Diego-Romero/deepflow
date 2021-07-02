import React from 'react';
import { withAuthUser, AuthAction } from 'next-firebase-auth';
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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { LoggedOutLayout } from '../components/layouts/LoggedOutLayout';

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
          <Image src={imageUrl} alt="Picture of the author" layout="fill" />
        </Box>
      </Grid>
      <Divider />
    </Stack>
  );
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
        <Stack maxW="container.lg" spacing={['12']}>
          <CardWithImageContent imageUrl="/../public/images/goals.svg">
            <Stack spacing={6} textAlign="left">
              <Heading size="lg">Why Deepflow?</Heading>
              <Text>
                Deepflow is a software research project whose focus is to find
                out whether it is possible to help the user achieve more and
                better periods of{' '}
                <Link
                  textDecor="underline"
                  href="https://blog.doist.com/deep-work/"
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
          <Grid gridTemplateColumns={['1fr 4fr']}>
            <Stack spacing={4}>
              <Heading>How does it works?</Heading>
              <Text>
                Deepflow is a tool that helps you track your focused time and
                allows you to organise your tasks and todos.
              </Text>
              {/* <Box position="relative" boxSize={['300px', '400px', '500px']}> */}
            </Stack>
            <Image
              src={'/../public/images/screenshots/boards-screenshot.png'}
              alt=""
              // layout="fill"
              width="1280px"
              height="687"
            />
            {/* </Box> */}
          </Grid>
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

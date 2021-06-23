import { Grid } from '@chakra-ui/layout';
import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { User } from '../types';
import { Footer } from './Footer';
import { NavBar } from './Navbar';

interface Props {
  user: User | null;
}

export const PageLayout: React.FC<Props> = (props) => {
  const { children, user } = props;

  return (
    <Box>
      <Grid
        height="100vh"
        width="100vw"
        overflow="auto"
        display={['none', null, 'grid']}
        gridTemplateRows="auto 1fr auto"
        gridTemplateAreas="'header' 'main' 'footer'"
        minW="900px"
      >
        <NavBar user={user} />
        <Box bgColor="gray.200">{children}</Box>
        <Footer />
      </Grid>
      <Flex
        display={['flex', null, 'none']}
        flexDir="column"
        justifyContent="space-between"
        height="100vh"
        width="100vw"
      >
        <Box>
          <NavBar user={user} />
          <Box>{children}</Box>
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
};

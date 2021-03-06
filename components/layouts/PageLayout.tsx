import { Grid } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../types';
import { Footer } from '../ui/components/Footer';
import { NavBar } from '../ui/components/Navbar';
import { SideNav } from '../ui/sidenav/SideNav';

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
        gridTemplateRows="auto 1fr auto"
        gridTemplateAreas="'header' 'main' 'footer'"
      >
        <NavBar user={user} />
        <Grid
          bgColor="gray.200"
          gridTemplateColumns={user !== null ? 'auto 1fr' : '1fr'}
        >
          {user !== null ? <SideNav user={user} /> : null}
          <Box px={4}>{children}</Box>
        </Grid>
        <Footer />
      </Grid>
    </Box>
  );
};

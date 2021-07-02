import { Grid } from '@chakra-ui/layout';
import { Box } from '@chakra-ui/react';
import React from 'react';
import { User } from '../../types';
import { Footer } from '../ui/components/Footer';
import { NavBar } from '../ui/components/Navbar';

interface Props {}

export const LoggedOutLayout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <Box>
      <Grid
        height="100vh"
        width="100vw"
        overflow="auto"
        gridTemplateRows="auto 1fr"
        gridTemplateAreas="'header' 'main' "
        bgColor="transparent"
      >
        <NavBar user={null} />
        {children}
      </Grid>
    </Box>
  );
};

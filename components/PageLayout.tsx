import { Grid } from "@chakra-ui/layout";
import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import { Footer } from "./Footer";
import { NavBar } from "./Navbar";

export const PageLayout: React.FC = (props) => {
  const { children } = props;

  return (
    <Box>
      <Grid
        height="100vh"
        width="100vw"
        overflow="auto"
        display={["none", null, "grid"]}
        gridTemplateRows="auto 1fr auto"
        gridTemplateAreas="'header' 'main' 'footer'"
        minW="900px"
      >
        <NavBar />
        <Box>{children}</Box>
        <Footer />
      </Grid>
      <Flex
        display={["flex", null, "none"]}
        flexDir="column"
        justifyContent="space-between"
        height="100vh"
        width="100vw"
      >
        <Box>
          <NavBar />
          <Box>{children}</Box>
        </Box>
        <Footer />
      </Flex>
    </Box>
  );
};

import { Grid } from "@chakra-ui/layout";
import { Footer } from "./Footer";
import { NavBar } from "./Navbar";

export const PageLayout: React.FC = (props) => {
  const { children } = props;

  return (
    <Grid
      height="100vh"
      width="100vw"
      overflow="auto"
      gridTemplateRows="auto 1fr auto"
      gridTemplateAreas="'header' 'main' 'footer'"
    >
      <NavBar />
      {children}
      <Footer />
    </Grid>
  );
};

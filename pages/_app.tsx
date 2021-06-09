import { ChakraProvider } from "@chakra-ui/react";
import initAuth from "../utils/initAuth";
import type { AppProps /*, AppContext */ } from "next/app";
// import serviceAccount from "../serviceAccountKey.json";

// console.log(JSON.parse(process.env.SERVICE_ACCOUNT as string));
initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;

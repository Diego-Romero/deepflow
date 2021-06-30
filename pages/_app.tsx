import { ChakraProvider } from '@chakra-ui/react';
import '../styles/globals.css';
import initAuth from '../utils/initAuth';
import type { AppProps /*, AppContext */ } from 'next/app';

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;

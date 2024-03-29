import '../styles/globals.css';
import 'materialize-css/dist/css/materialize.min.css';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const isWindow = typeof window !== 'undefined';
  if (!isWindow) {
    return null;
  }
  return <Component {...pageProps} />;
};

export default MyApp;

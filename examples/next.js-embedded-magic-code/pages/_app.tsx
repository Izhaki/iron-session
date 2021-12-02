import { AppProps } from "next/app";
import SessionProvider from "lib/SessionProvider";
import Layout from "components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

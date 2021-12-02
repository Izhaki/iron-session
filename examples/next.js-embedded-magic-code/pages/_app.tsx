import { AppProps } from "next/app";
import SessionProvider from "lib/SessionProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

import * as React from "react";
import { SWRConfig } from "swr";
import fetchJson from "lib/fetchJson";

export default function withSWR<T>(WrappedComponent: React.ComponentType<T>) {
  const WithSWR = (props: T) => (
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <WrappedComponent {...props} />
    </SWRConfig>
  );

  return WithSWR;
}

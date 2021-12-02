import * as React from "react";
import withSWR from "./withSWR";
import useSWR from "swr";
import { User } from "lib/Session";
import fetchJson from "./fetchJson";
import SessionContext from "./SessionContext";

export interface Props {
  children: React.ReactNode;
}

function SessionProvider({ children }: Props) {
  const { data: user, error, mutate: mutateUser } = useSWR<User>("/api/user");

  const isLoading = !error && !user;

  const login = React.useCallback(
    async (username) =>
      mutateUser(
        await fetchJson("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }),
        false,
      ),
    [mutateUser],
  );

  const logout = React.useCallback(
    async () =>
      mutateUser(await fetchJson("/api/logout", { method: "POST" }), false),
    [mutateUser],
  );

  return (
    <SessionContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export default withSWR(SessionProvider);

import { createContext } from "react";
import { Session } from "lib/Session";

const noContextProvierMessage =
  "Trying to access SessionContext, but no provider in ancestors";

const SessionContext = createContext<{
  session?: Session;
  isLoading: boolean;
  login: (username: string) => Promise<Session | undefined>;
  logout: () => Promise<Session | undefined>;
}>({
  isLoading: false,
  login: () => {
    throw new Error(noContextProvierMessage);
  },
  logout: () => {
    throw new Error(noContextProvierMessage);
  },
});

export default SessionContext;

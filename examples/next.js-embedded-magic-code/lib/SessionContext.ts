import { createContext } from "react";
import { User } from "pages/api/user";

const noContextProvierMessage =
  "Trying to access SessionContext, but no provider in ancestors";

const SessionContext = createContext<{
  user?: User;
  isLoading: boolean;
  login: (username: string) => Promise<User | undefined>;
  logout: () => Promise<User | undefined>;
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

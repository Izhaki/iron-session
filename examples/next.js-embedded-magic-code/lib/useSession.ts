import { useContext } from "react";
import { FetchError } from "./fetchJson";
import SessionContext from "./SessionContext";

export { FetchError };

export default function useSession() {
  return useContext(SessionContext);
}

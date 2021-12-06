import useSWR from "swr";
import type { User } from "pages/api/user";
import type { Events } from "pages/api/events";
import fetchJson from "lib/fetchJson";

export default function useEvents(user: User | undefined) {
  const fetcher = (input: RequestInfo, init = {}) =>
    fetchJson<Events>(input, {
      ...init,
      method: "POST",
    });

  // We do a request to /api/events only if the user is logged in
  const url = user?.isLoggedIn ? `/api/events` : null;

  const { data: events } = useSWR<Events>(url, fetcher);

  return { events };
}

import { getCookieValue } from "lib/cookies";
import { defaultCSRFKeys } from "lib/csrf";

export default async function fetchJson<JSON = unknown>(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<JSON> {
  const headers = new Headers(init.headers);

  // GET requests (the default) can leak the CSRF token.
  // (see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)
  if (init.method && init.method.toLowerCase() !== "get") {
    const csrfToken = getCookieValue("csrf");

    headers.append(defaultCSRFKeys.header, csrfToken);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // if the server replies, there's always some data in json
  // if there's a network error, it will throw at the previous line
  const data = await response.json();

  // response.ok is true when res.status is 2xx
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
  if (response.ok) {
    return data;
  }

  throw new FetchError({
    message: response.statusText,
    response,
    data,
  });
}

export class FetchError extends Error {
  response: Response;
  data: {
    message: string;
  };
  constructor({
    message,
    response,
    data,
  }: {
    message: string;
    response: Response;
    data: {
      message: string;
    };
  }) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = "FetchError";
    this.response = response;
    this.data = data ?? { message: message };
  }
}

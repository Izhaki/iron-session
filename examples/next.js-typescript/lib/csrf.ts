import { createHmac, randomBytes } from "crypto";
import type { IncomingMessage } from "http";

interface CSRFKeys {
  header: string;
  body: string;
}

export const defaultCSRFKeys: CSRFKeys = {
  header: "x-csrf-token",
  body: "csrf-token",
};

/**
 * A function to generate a CSRF Token.
 *
 * This function take an id, which can be either the session id or a request id. Either of these
 * will be encrypted in (and read from) the session cookie.
 * (see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)
 *
 * This is essential to prevent cookie fixation by either exploited subdomains, or man-in-the-middle HTTP connections,
 * where an attacker can inject a valid CSRF token by obtaining one when accessing the site.
 * (see https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf)
 *
 * If cookie fixation attacks are protected against via other means, users can provide a const `id`, like ''.
 *
 * Note that session should be created (unless already exists) at the first time the user lands on the page - authenticated or not.
 * The session ID should be refreshed upon login/logout. This is to prevent CSRF Login attack.
 * (see https://seclab.stanford.edu/websec/csrf/csrf.pdf)
 *
 * The function also take a private secret, which is fed into `crypto.createHmac` - the hashing algorithm ensures
 * the token integrity, whereas the secret ensures authenticity - meaning that the token was generate on the intended
 * server using the private secret.
 * (see https://security.stackexchange.com/questions/20129/how-and-when-do-i-use-hmac)
 *
 * When setting a cookie with this CSRF token, the following options should be used:
 * {
 *   // Set `httpOnly` to false, so javascript can read this cookie.
 *   httpOnly: false,
 *   // sameSite is set to strict because csrf tokens should be not be read from cookies anyhow, so "lax"
 *   // gives us nothing here.
 *   sameSite: "strict",
 * }
 *
 * @export
 * @param {string} id - either session id, or request id, depending whether the token is per session or per request.
 * @param {string} secret - a private secret, like the one used for encryption.
 * @return {string} a CSRF token
 */
export function createCSRFToken(id: string, secret: string): string {
  const csrfToken = randomBytes(32).toString("hex");
  const csrfTokenHash = createHmac("sha256", secret)
    .update(`${csrfToken}${id}`)
    .digest("hex");
  return `${csrfToken}|${csrfTokenHash}`;
}

type Request = IncomingMessage & { body: Record<string, string> };

/**
 * Retrieves a CSRF token from a request.
 *
 * CSRF tokens should not be submitted using cookies, as CSRF attacks are only possible because cookies (session or not)
 * are sent by the browser.
 * (see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)
 *
 * For AJAX requests, the recommended way is to use a custom request header, as this add another layer of protection.
 * (see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#use-of-custom-request-headers)
 * (see https://seclab.stanford.edu/websec/csrf/csrf.pdf)
 *
 * For simple requests (like form submission), the token should be submitted in the request payload.
 * (see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)
 *
 * @param req the request from which to retrieve the token
 */
export function getCSRFToken(req: Request, keys: CSRFKeys = defaultCSRFKeys) {
  // GET requests can leak the CSRF token.
  // (see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)
  if (req.method?.toLowerCase() === "get") {
    throw new Error(
      "CSRF token was request for a GET request, which means it can leak in various locations.",
    );
  }

  // For AJAX requests
  let token = req.headers[keys.header] as string;
  if (token === undefined) {
    // For simple requests
    token = req.body[keys.body];
  }
  // Decode the token as it may be encoded when stored as a cookie
  return decodeURIComponent(token);
}

/**
 * Validates a CSRF token
 * Throws if the token is not valid
 *
 * @param token the token sent with the request
 * @param id - @see {@link createCSRFToken}
 * @param secret - @see {@link createCSRFToken}
 */
export function ValidateCSRFToken(token: string, id: string, secret: string) {
  const [csrfToken, csrfTokenHash] = token.split("|");

  const expectedCsrfTokenHash = createHmac("sha256", secret)
    .update(`${csrfToken}${id}`)
    .digest("hex");

  if (csrfTokenHash !== expectedCsrfTokenHash) {
    throw new Error("invalid CSRF token.");
  }
}

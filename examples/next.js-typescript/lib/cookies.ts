import type { ServerResponse } from "http";

export function addToCookies(res: ServerResponse, cookieValue: string) {
  let existingSetCookie =
    (res.getHeader("set-cookie") as string[] | string) ?? [];
  if (typeof existingSetCookie === "string") {
    existingSetCookie = [existingSetCookie];
  }
  res.setHeader("set-cookie", [...existingSetCookie, cookieValue]);
}

// https://stackoverflow.com/a/25490531/1179377
export const getCookieValue = (name: string) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

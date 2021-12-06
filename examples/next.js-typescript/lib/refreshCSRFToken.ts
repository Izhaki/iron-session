import { randomBytes } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize as serializeCookie } from "cookie";
import { createCSRFToken } from "lib/csrf";
import { addToCookies } from "lib/cookies";

function getCSRFCookie(sessionId: string): string {
  // Create csrf toekn
  const csrfToken = createCSRFToken(
    sessionId,
    process.env.SECRET_COOKIE_PASSWORD as string,
  );

  // To cookie
  const cookieValue = serializeCookie("csrf", csrfToken, {
    // Set `httpOnly` to false, so javascript can read this cookie
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    // sameSite is set to strict because csrf tokens should be not be read from cookies anyhow, so "lax"
    // gives us nothing here.
    sameSite: "strict",
    maxAge: 2147483647 - 60,
    path: "/",
  });

  return cookieValue;
}

export default async function refreshCSRFToken(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Generate and save session id to session.
  const sessionId = randomBytes(16).toString("hex");
  req.session.id = sessionId;
  await req.session.save();

  addToCookies(res, getCSRFCookie(sessionId));
}

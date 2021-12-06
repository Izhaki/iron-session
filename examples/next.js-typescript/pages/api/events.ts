import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { Octokit } from "octokit";
import { getCSRFToken, ValidateCSRFToken } from "lib/csrf";

import type { Endpoints } from "@octokit/types";
import { NextApiRequest, NextApiResponse } from "next";

export type Events =
  Endpoints["GET /users/{username}/events"]["response"]["data"];

const octokit = new Octokit();

export default withIronSessionApiRoute(eventsRoute, sessionOptions);

async function eventsRoute(
  req: NextApiRequest,
  res: NextApiResponse<Events | { message: string }>,
) {
  const user = req.session.user;

  if (!user || user.isLoggedIn === false) {
    res.status(401).end();
    return;
  }

  try {
    const csrfToken = getCSRFToken(req);
    const secret = process.env.SECRET_COOKIE_PASSWORD as string;
    ValidateCSRFToken(csrfToken, req.session.id, secret);
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
    return;
  }

  try {
    const { data: events } =
      await octokit.rest.activity.listPublicEventsForUser({
        username: user.login,
      });

    res.json(events);
  } catch (error) {
    res.status(200).json([]);
  }
}

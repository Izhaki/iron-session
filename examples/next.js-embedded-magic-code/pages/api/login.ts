import type { Session } from "lib/Session";

import { NextApiRequest, NextApiResponse } from "next";

import { withSessionRoute } from "lib/withSession";

interface ErrorResponse {
  message: Error["message"];
}

async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse<Session | ErrorResponse>,
) {
  try {
    const user = {
      isLoggedIn: true,
      login: "Izhaki",
      avatarUrl: "https://avatars.githubusercontent.com/u/880132?v=4",
    };

    const session = { user };

    req.session.user = user;
    await req.session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export default withSessionRoute(loginRoute);

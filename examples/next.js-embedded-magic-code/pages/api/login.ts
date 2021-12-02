import type { User } from "lib/Session";

import { NextApiRequest, NextApiResponse } from "next";

import { withSessionRoute } from "lib/withSession";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = {
      isLoggedIn: true,
      login: "Izhaki",
      avatarUrl: "https://avatars.githubusercontent.com/u/880132?v=4",
    } as User;

    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export default withSessionRoute(loginRoute);

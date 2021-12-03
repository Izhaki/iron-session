import type { Session, User } from "lib/Session";
import { Octokit } from "octokit";
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "lib/withSession";

const octokit = new Octokit();

interface ErrorResponse {
  message: Error["message"];
}

async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse<Session | ErrorResponse>,
) {
  const { username } = await req.body;

  try {
    const {
      data: { login, avatar_url },
    } = await octokit.rest.users.getByUsername({ username });

    const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User;

    const session = { user };

    req.session.user = user;
    await req.session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export default withSessionRoute(loginRoute);

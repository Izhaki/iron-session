import { withSessionRoute } from "lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "lib/Session";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<Session>) {
  req.session.destroy();
  res.json({ user: { isLoggedIn: false, login: "", avatarUrl: "" } });
}

export default withSessionRoute(logoutRoute);

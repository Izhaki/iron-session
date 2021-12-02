import { withSessionRoute } from "lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import type { User } from "lib/Session";

function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();
  res.json({ isLoggedIn: false, login: "", avatarUrl: "" });
}

export default withSessionRoute(logoutRoute);

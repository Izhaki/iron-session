import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import type { User } from "pages/api/user";
import refreshCSRFToken from "lib/refreshCSRFToken";

export default withIronSessionApiRoute(logoutRoute, sessionOptions);

async function logoutRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  req.session.destroy();

  await refreshCSRFToken(req, res);

  res.json({ isLoggedIn: false, login: "", avatarUrl: "" });
}

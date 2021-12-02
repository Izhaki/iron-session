import { withSessionRoute } from "lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "lib/Session";

async function sessionRoute(
  req: NextApiRequest,
  res: NextApiResponse<Session>,
) {
  if (req.session.user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      user: {
        ...req.session.user,
        isLoggedIn: true,
      },
    });
  } else {
    res.json({
      user: {
        isLoggedIn: false,
        login: "",
        avatarUrl: "",
      },
    });
  }
}

export default withSessionRoute(sessionRoute);

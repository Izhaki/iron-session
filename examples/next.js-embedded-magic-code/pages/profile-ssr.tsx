import React from "react";
import { withSessionSsr } from "lib/withSession";
import { User } from "lib/Session";

import { InferGetServerSidePropsType } from "next";

export default function SsrProfile({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <h1>Your GitHub profile</h1>
      <h2>
        This page uses{" "}
        <a href="https://nextjs.org/docs/basic-features/pages#server-side-rendering">
          Server-side Rendering (SSR)
        </a>{" "}
        and{" "}
        <a href="https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering">
          getServerSideProps
        </a>
      </h2>

      {user?.isLoggedIn && (
        <>
          <p style={{ fontStyle: "italic" }}>
            Public data, from{" "}
            <a href={`https://github.com/${user.login}`}>
              https://github.com/{user.login}
            </a>
            , reduced to `login` and `avatar_url`.
          </p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}
    </>
  );
}

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {
  const user = req.session.user;

  if (user === undefined) {
    res.setHeader("location", "/login");
    res.statusCode = 302;
    res.end();
    return {
      props: {
        user: { isLoggedIn: false, login: "", avatarUrl: "" } as User,
      },
    };
  }

  return {
    props: { user: req.session.user },
  };
});

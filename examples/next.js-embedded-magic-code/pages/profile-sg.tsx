import React from "react";
import Layout from "components/Layout";
import useSession from "lib/useSession";
import withAccessRestrictions from "lib/withAccessRestrictions";

// Make sure to check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
function SgProfile() {
  const { session } = useSession();

  const user = session?.user;

  return (
    <Layout>
      <h1>Your GitHub profile</h1>
      <h2>
        This page uses{" "}
        <a href="https://nextjs.org/docs/basic-features/pages#static-generation-recommended">
          Static Generation (SG)
        </a>{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        and the <a href="/api/session">/api/session</a> route (using{" "}
        <a href="https://github.com/vercel/swr">vercel/SWR</a>)
      </h2>
      {user && (
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
    </Layout>
  );
}

export default withAccessRestrictions({
  hasAccess: (user) => Boolean(user?.isLoggedIn),
  unauthorizedRedirect: "/login",
  loading: <div>Loading...</div>,
})(SgProfile);

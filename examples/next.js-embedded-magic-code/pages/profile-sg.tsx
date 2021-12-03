import React from "react";
import useSession from "lib/useSession";
import useEvents from "lib/useEvents";
import withAccessRestrictions from "lib/withAccessRestrictions";

// Make sure to check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
function SgProfile() {
  const { session } = useSession();
  const user = session?.user;

  const { events } = useEvents(user);

  return (
    <>
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
      {events !== undefined && (
        <p>
          Number of GitHub events for user: <b>{events.length}</b>.{" "}
          {events.length > 0 && (
            <>
              Last event type: <b>{events[0].type}</b>
            </>
          )}
        </p>
      )}
    </>
  );
}

export default withAccessRestrictions({
  hasAccess: (user) => Boolean(user?.isLoggedIn),
  unauthorizedRedirect: "/login",
  loading: <div>Loading...</div>,
})(SgProfile);

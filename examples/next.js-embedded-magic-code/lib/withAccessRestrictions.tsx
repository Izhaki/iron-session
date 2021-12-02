import * as React from "react";
import { useRouter } from "next/router";
import useSession from "lib/useSession";
import { User } from "lib/Session";

interface WithAccessRestrictionsOptions {
  hasAccess: (user: User | undefined) => boolean;
  unauthorizedRedirect: string;
  loading?: React.ReactElement;
}

// We want `useLayoutEffect` on the client so no extra rendering cycle.
// This, however, throws a warning for SSR, so use `React.useEffect` on the server.
// That's how MUI do it.
const useEnhancedEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const withAccessRestrictions =
  (options: WithAccessRestrictionsOptions) =>
  <T,>(WrappedComponent: React.ComponentType<T>) => {
    const { hasAccess, unauthorizedRedirect, loading = null } = options;

    const WithAccessRestrictions = (props: T) => {
      const { user, isLoading } = useSession();
      const router = useRouter();

      const authorized = hasAccess(user);

      useEnhancedEffect(() => {
        if (isLoading) {
          return; // Do nothing if still loading
        }

        if (!authorized) {
          router.push(unauthorizedRedirect);
        }
      }, [authorized, isLoading, router]);

      if (authorized) {
        return <WrappedComponent {...props} />;
      }

      // If we get here it's because the user is not authorized because we are still loading.
      // If we are not loading and the user is not authorized, useLayoutEffect will redirect.
      return loading;
    };

    return WithAccessRestrictions;
  };

export default withAccessRestrictions;

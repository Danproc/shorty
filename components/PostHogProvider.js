"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog, trackEvent } from "@/libs/posthog/client";

export default function PostHogProvider({ children, user }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize PostHog
    const posthog = initPostHog();

    // Track page views
    if (posthog && pathname) {
      trackEvent("$pageview", {
        $current_url: window.location.href,
        path: pathname,
      });
    }
  }, [pathname]);

  // Identify user when logged in
  useEffect(() => {
    if (user?.id && user?.email) {
      const posthog = initPostHog();
      if (posthog) {
        posthog.identify(user.id, {
          email: user.email,
        });
      }
    }
  }, [user]);

  return <>{children}</>;
}

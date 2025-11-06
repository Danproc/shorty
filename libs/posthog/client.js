"use client";

import posthog from "posthog-js";

let posthogInitialized = false;

export function initPostHog() {
  if (
    typeof window !== "undefined" &&
    !posthogInitialized &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // We'll handle this manually
      capture_pageleave: true,
      autocapture: false, // We'll track specific events
    });
    posthogInitialized = true;
  }

  return posthog;
}

export function identifyUser(userId, email) {
  if (posthogInitialized && userId) {
    posthog.identify(userId, { email });
  }
}

export function trackEvent(eventName, properties = {}) {
  if (posthogInitialized) {
    posthog.capture(eventName, properties);
  }
}

export function resetUser() {
  if (posthogInitialized) {
    posthog.reset();
  }
}

export { posthog };

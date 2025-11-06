import { PostHog } from "posthog-node";

let posthogClient = null;

export function getPostHogClient() {
  if (!posthogClient && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    });
  }

  return posthogClient;
}

export async function trackServerEvent(eventName, properties = {}) {
  const client = getPostHogClient();

  if (client) {
    try {
      client.capture({
        event: eventName,
        ...properties,
      });
      await client.flush();
    } catch (error) {
      console.error("PostHog server tracking error:", error);
    }
  }
}

export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
  }
}

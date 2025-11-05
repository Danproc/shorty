import config from "@/config";
import { getSEOTags } from "@/libs/seo";

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

export const metadata = getSEOTags({
  title: `Sign-in to ${config.appName}`,
  canonicalUrlRelative: "/auth/signin",
});

export default function Layout({ children }) {
  return <>{children}</>;
}

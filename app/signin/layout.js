import config from "@/config";
import { getSEOTags } from "@/libs/seo";

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';

export const metadata = getSEOTags({
  title: `Sign In - Access Your Dashboard | ${config.appName}`,
  description: `Sign in to ${config.appName} to access your personal dashboard. Manage QR codes, shortened URLs, markdown files, and view analytics. Free signup with Google or email.`,
  keywords: ["sign in", "login", "user account", "dashboard access"],
  canonicalUrlRelative: "/signin",
  openGraph: {
    title: `Sign In | ${config.appName}`,
    description: "Access your personal dashboard to manage all your QR codes, URLs, and files.",
    url: "https://cuer.io/signin",
  },
});

export default function Layout({ children }) {
  return <>{children}</>;
}

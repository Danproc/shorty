import { redirect } from "next/navigation";
import { createClient } from "@/libs/supabase/server";
import { checkSubscription } from "@/libs/subscription";
import config from "@/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardNav from "@/components/dashboard/DashboardNav";

// This is a server-side component to ensure the user is logged in and has an active subscription.
// If not logged in, it will redirect to the login page.
// If logged in but no subscription, it will redirect to the pricing page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://shipfa.st/docs/tutorials/private-page
export default async function LayoutPrivate({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(config.auth.loginUrl);
  }

  // Check if user has an active subscription
  const { hasAccess } = await checkSubscription(user.id);

  if (!hasAccess) {
    // Redirect to pricing page if no subscription
    redirect("/pricing");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <DashboardNav />
      <div className="flex-1 lg:pl-64">
        {children}
      </div>
      <Footer />
    </div>
  );
}

import { createClient } from "@/libs/supabase/server";
import { getUserProfile } from "@/libs/subscription";
import config from "@/config";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonCheckout from "@/components/ButtonCheckout";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: `Pricing - ${config.appName}`,
  description: "Subscribe to access your dashboard, analytics, and manage all your QR codes, URLs, and files in one place.",
};

export default async function PricingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    profile = await getUserProfile(user.id);

    // If user has an active subscription, redirect to dashboard
    if (profile?.has_access) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Generate QR codes and shorten URLs for free. Subscribe to unlock your personal dashboard with analytics and asset management.
            </p>
          </div>

          {/* Current Subscription Status */}
          {user && profile && (
            <div className="max-w-2xl mx-auto mb-12">
              {profile.has_access ? (
                <div className="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Active Subscription</h3>
                    <div className="text-sm">You have full access to the dashboard!</div>
                  </div>
                  <Link href="/dashboard" className="btn btn-sm">
                    Go to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 className="font-bold">No Active Subscription</h3>
                    <div className="text-sm">Subscribe below to unlock dashboard access</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Free Tier */}
          <div className="mb-16">
            <div className="card bg-base-200 shadow-xl max-w-2xl mx-auto">
              <div className="card-body">
                <h2 className="card-title text-2xl">Free Tier</h2>
                <p className="text-base-content/70 mb-4">
                  Use our tools without any subscription
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited QR code generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited URL shortening</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Unlimited markdown file conversion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>All QR codes and URLs work forever</span>
                  </li>
                </ul>
                <div className="flex gap-4">
                  <Link href="/qr-generator" className="btn btn-outline flex-1">
                    QR Generator
                  </Link>
                  <Link href="/shorten" className="btn btn-outline flex-1">
                    URL Shortener
                  </Link>
                  <Link href="/markdown" className="btn btn-outline flex-1">
                    Markdown Converter
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plans */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-center mb-4">
              Premium Dashboard Access
            </h2>
            <p className="text-center text-base-content/70 mb-12">
              Subscribe to unlock your personal dashboard with advanced features
            </p>

            <div className="flex justify-center max-w-3xl mx-auto">
              {config.stripe.plans.map((plan) => (
                <div
                  key={plan.priceId}
                  className={`card bg-base-100 shadow-xl w-full ${
                    plan.isFeatured ? "ring-2 ring-primary" : ""
                  }`}
                >
                  {plan.isFeatured && (
                    <div className="badge badge-primary absolute top-4 right-4">
                      POPULAR
                    </div>
                  )}

                  <div className="card-body">
                    <h3 className="card-title text-2xl mb-2">{plan.name}</h3>
                    <p className="text-base-content/70 mb-4">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">${plan.price}</span>
                        <span className="text-base-content/70">/month</span>
                      </div>
                      {plan.priceAnchor && (
                        <div className="text-sm text-base-content/50">
                          <span className="line-through">${plan.priceAnchor}/month</span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6 flex-1">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="font-semibold">Personal Dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>View all your QR codes in one place</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Manage all your shortened URLs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Access all your markdown files</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Analytics for all assets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>Click tracking and statistics</span>
                      </li>
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>

                    {user ? (
                      profile?.has_access ? (
                        <button className="btn btn-disabled btn-block" disabled>
                          Current Plan
                        </button>
                      ) : (
                        <ButtonCheckout
                          priceId={plan.priceId}
                          mode="subscription"
                        />
                      )
                    ) : (
                      <Link href="/signin" className="btn btn-primary btn-block">
                        Sign In to Subscribe
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion" defaultChecked />
                <div className="collapse-title text-xl font-medium">
                  Can I use the tools without subscribing?
                </div>
                <div className="collapse-content">
                  <p>
                    Absolutely! You can generate QR codes, shorten URLs, and convert markdown files completely free without any subscription. All your generated assets will work forever.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-medium">
                  What do I get with a subscription?
                </div>
                <div className="collapse-content">
                  <p>
                    A subscription unlocks your personal dashboard where you can view, manage, and analyze all your QR codes, shortened URLs, and markdown files in one place. You&apos;ll get detailed analytics, click tracking, and easy asset management.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-medium">
                  Can I cancel anytime?
                </div>
                <div className="collapse-content">
                  <p>
                    Yes! You can cancel your subscription at any time from your billing settings. You&apos;ll continue to have access until the end of your billing period. Your generated QR codes and URLs will continue to work even after cancellation.
                  </p>
                </div>
              </div>

              <div className="collapse collapse-plus bg-base-200">
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-xl font-medium">
                  What happens to my assets if I cancel?
                </div>
                <div className="collapse-content">
                  <p>
                    All your QR codes, shortened URLs, and markdown files will continue to work forever, even if you cancel your subscription. You&apos;ll just lose access to the dashboard and analytics features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

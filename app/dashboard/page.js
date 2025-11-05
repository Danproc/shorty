import ButtonAccount from "@/components/ButtonAccount";
import URLShortenerForm from "@/components/URLShortenerForm";
import URLsList from "@/components/URLsList";

export const dynamic = "force-dynamic";

// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page
export default async function Dashboard() {
  return (
    <main className="min-h-screen p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">My Short URLs</h1>
          <ButtonAccount />
        </div>

        {/* Create New Short URL */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create New Short URL</h2>
            <p className="text-base-content/70 mb-4">
              As a registered user, you can create custom slugs and track all your links!
            </p>
            <URLShortenerForm showCustomSlug={true} />
          </div>
        </div>

        {/* My URLs List */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Your URLs</h2>
            <URLsList />
          </div>
        </div>
      </section>
    </main>
  );
}

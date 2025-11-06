import Link from "next/link";

export const metadata = {
  title: "URLs | Dashboard",
};

export default function URLsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Short URLs</h1>
          <p className="text-base-content/70 mt-1">
            Manage your shortened URLs and view analytics
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Your URLs</h2>
              <Link href="/shorten" className="btn btn-sm btn-primary rounded-lg">
                Create Short URL
              </Link>
            </div>
            <div className="text-center py-12">
              <p className="text-base-content/60">Your shortened URLs will appear here</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

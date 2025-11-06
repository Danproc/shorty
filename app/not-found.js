import Link from "next/link";

// Clean, modern 404 page for Cuer.io
export default function Custom404() {
  return (
    <section className="relative bg-gradient-to-br from-base-200 to-base-300 text-base-content h-screen w-full flex flex-col justify-center items-center p-10">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Large 404 text with gradient */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-primary to-secondary"></div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-base-content/70 max-w-md mx-auto">
            Oops! The page you&apos;re looking for seems to have vanished into thin air.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link href="/" className="btn btn-primary btn-lg rounded-lg gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>

          <Link href="/shorten" className="btn btn-outline btn-lg rounded-lg gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
            Create Short URL
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center gap-8 pt-8 opacity-30">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </section>
  );
}

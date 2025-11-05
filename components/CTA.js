import Link from "next/link";

const CTA = () => {
  return (
    <section className="bg-gradient-to-br from-primary to-primary/80">
      <div className="max-w-7xl mx-auto px-8 py-16 md:py-24 text-center">
        <div className="flex flex-col items-center max-w-3xl mx-auto">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-6 text-primary-content">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 text-primary-content">
            Join thousands of users who trust our tools for their link shortening
            and QR code needs. No signup required to start!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/shorten" className="btn btn-neutral btn-lg">
              Shorten a URL
            </Link>
            <Link href="/qr-generator" className="btn btn-outline btn-lg border-primary-content text-primary-content hover:bg-primary-content hover:text-primary">
              Generate QR Code
            </Link>
          </div>

          <p className="mt-8 text-sm text-primary-content/80">
            Want more features? Create a free account for custom URLs and link management.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;

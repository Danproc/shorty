'use client';

import Link from 'next/link';

// Shorty - Landing page hero section with animated backgrounds and tool cards
const Hero = () => {
  return (
    <section className="flex items-center justify-center px-8 py-20 relative overflow-hidden md:min-h-[85vh]">
      {/* Animated background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-bold text-6xl lg:text-8xl tracking-tight mb-6 bg-gradient-to-br from-base-content to-base-content/60 bg-clip-text text-transparent">
            Shorty
          </h1>
          <p className="text-2xl lg:text-3xl text-primary font-semibold mb-4">
            Simple tools for the modern web
          </p>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Shorten URLs, generate QR codes, and convert Markdown to HTML. Fast, free, and beautifully minimal.
          </p>
        </div>

        {/* Tools Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* URL Shortener Tool */}
          <Link href="/shorten" className="group">
            <div className="card bg-base-200/80 backdrop-blur-sm hover:bg-base-300/80 border border-base-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(62,207,142,0.15)] transition-all duration-500 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="card-body relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/0 group-hover:shadow-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </div>
                  <h2 className="card-title text-2xl">URL Shortener</h2>
                </div>
                <p className="text-base-content/60 mb-4">
                  Transform long URLs into short, memorable links with click tracking.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all duration-300">
                  <span>Try it now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* QR Code Generator Tool */}
          <Link href="/qr-generator" className="group">
            <div className="card bg-base-200/80 backdrop-blur-sm hover:bg-base-300/80 border border-base-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(62,207,142,0.15)] transition-all duration-500 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="card-body relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/0 group-hover:shadow-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-2xl">QR Generator</h2>
                </div>
                <p className="text-base-content/60 mb-4">
                  Create high-quality QR codes for any URL. Download as PNG or SVG.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all duration-300">
                  <span>Try it now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Markdown Converter Tool */}
          <Link href="/markdown" className="group">
            <div className="card bg-base-200/80 backdrop-blur-sm hover:bg-base-300/80 border border-base-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(62,207,142,0.15)] transition-all duration-500 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="card-body relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/0 group-hover:shadow-primary/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  </div>
                  <h2 className="card-title text-2xl">Markdown to HTML</h2>
                </div>
                <p className="text-base-content/60 mb-4">
                  Convert Markdown to clean HTML instantly with live preview.
                </p>
                <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all duration-300">
                  <span>Try it now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;

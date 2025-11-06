import { Suspense } from 'react'
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
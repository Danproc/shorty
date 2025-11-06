"use client";

import { useState } from "react";
import apiClient from "@/libs/api";

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBilling = async () => {
    setIsLoading(true);
    try {
      const { url } = await apiClient.post("/stripe/create-portal", {
        returnUrl: window.location.href,
      });
      window.location.href = url;
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Billing</h1>
          <p className="text-base-content/70 mt-1">
            Manage your subscription and billing information
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Subscription</h2>
            <p className="text-base-content/70 mb-4">
              Manage your billing information, payment methods, and subscription status.
            </p>
            <button
              onClick={handleBilling}
              disabled={isLoading}
              className="btn btn-primary rounded-lg w-fit"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Manage Billing"
              )}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

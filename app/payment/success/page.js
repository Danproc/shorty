"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/libs/api";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Processing your payment...");
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 30; // 30 attempts * 2 seconds = 60 seconds max

  useEffect(() => {
    let intervalId;
    let attemptCount = 0;

    const checkSubscription = async () => {
      try {
        attemptCount++;
        setAttempts(attemptCount);

        console.log(`Checking subscription status (attempt ${attemptCount}/${MAX_ATTEMPTS})...`);

        // Check subscription status by trying to access a protected endpoint
        const response = await apiClient.get("/auth/me");

        if (response?.has_access) {
          console.log("✅ Subscription confirmed! Redirecting to dashboard...");
          setStatus("success");
          setMessage("Payment successful! Redirecting to dashboard...");

          // Clear the interval
          if (intervalId) clearInterval(intervalId);

          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else if (attemptCount >= MAX_ATTEMPTS) {
          // Timeout after MAX_ATTEMPTS
          console.error("❌ Subscription check timeout");
          setStatus("error");
          setMessage(
            "Payment processing is taking longer than expected. Please refresh the page or contact support if the issue persists."
          );

          if (intervalId) clearInterval(intervalId);
        } else {
          // Still processing, continue polling
          console.log("⏳ Subscription not yet confirmed, will retry...");
          setMessage(`Processing your payment... (${attemptCount}/${MAX_ATTEMPTS})`);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);

        if (attemptCount >= MAX_ATTEMPTS) {
          setStatus("error");
          setMessage(
            "Unable to verify your payment. Please check your dashboard or contact support."
          );

          if (intervalId) clearInterval(intervalId);
        }
      }
    };

    // Initial check immediately
    checkSubscription();

    // Then poll every 2 seconds
    intervalId = setInterval(checkSubscription, 2000);

    // Cleanup
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          {status === "processing" && (
            <>
              <div className="mb-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
              <h2 className="card-title text-2xl mb-2">Processing Payment</h2>
              <p className="text-base-content/70 mb-4">{message}</p>
              <div className="text-sm text-base-content/50">
                This usually takes just a few seconds...
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="card-title text-2xl mb-2 text-success">Success!</h2>
              <p className="text-base-content/70">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mb-4">
                <svg
                  className="w-16 h-16 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="card-title text-2xl mb-2 text-error">
                Processing Delayed
              </h2>
              <p className="text-base-content/70 mb-6">{message}</p>
              <div className="flex gap-2 w-full">
                <button
                  className="btn btn-primary flex-1"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
                <button
                  className="btn btn-outline flex-1"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

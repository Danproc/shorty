"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/libs/supabase/client";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  return (
    <main className="p-4 md:p-8 pb-24 bg-base-200">
      <section className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Account Settings</h1>
          <p className="text-base-content/70 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl rounded-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">Email</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input input-bordered w-full rounded-lg bg-base-200"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">Name</span>
                </label>
                <input
                  type="text"
                  value={user?.user_metadata?.name || ""}
                  disabled
                  className="input input-bordered w-full rounded-lg bg-base-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

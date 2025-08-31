import {
  Settings,
  Bell,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DashboardLayout } from "../components/DashboardLayout";

// NOTE: This is still a mockup. Data fetching and functional components
// would need to be implemented in a future step.

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "saved">("overview");

  const actions = (
    <div className="flex items-center space-x-4">
      <button className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200">
        <Bell className="w-6 h-6" />
      </button>
      <Link
        to="/profile"
        className="p-3 rounded-xl border border-jobequal-neutral-dark text-jobequal-text-muted hover:text-jobequal-green hover:bg-jobequal-green-light transition-all duration-200"
      >
        <Settings className="w-6 h-6" />
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Welcome back, Alex! 👋"
      subtitle="Ready to find your next opportunity? You have 3 new job matches."
      actions={actions}
    >
      {/* Quick Stats Placeholder */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {/* Placeholder cards */}
        <div className="bg-white/90 p-6 rounded-2xl border">...</div>
        <div className="bg-white/90 p-6 rounded-2xl border">...</div>
        <div className="bg-white/90 p-6 rounded-2xl border">...</div>
        <div className="bg-white/90 p-6 rounded-2xl border">...</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border">
            {/* Tabs placeholder */}
          </div>

          {/* Tab Content Placeholder */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Tab Content Placeholder</h2>
            <div className="bg-white/90 p-12 rounded-2xl border text-center">
              Content for the selected tab would go here.
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Profile Progress Placeholder */}
          <div className="bg-white/90 p-8 rounded-3xl border">
            Profile Progress Card Placeholder
          </div>

          {/* Quick Actions Placeholder */}
          <div className="bg-white/90 p-8 rounded-3xl border">
            Quick Actions Placeholder
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { Navigation } from "@components/Navigation";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Helper function to make authenticated API requests
const fetchFromApi = async (endpoint: string, token: string | undefined, options: RequestInit = {}) => {
  if (!token) {
    return Promise.reject(new Error("No auth token provided."));
  }

  const res = await fetch(`/api/billing${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "An error occurred");
  }
  return res.json();
};

export default function SubscriptionBilling() {
  const { session } = useAuth();
  const token = session?.access_token;

  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ["subscription"],
    queryFn: () => fetchFromApi("/subscription", token),
    enabled: !!token,
  });

  const { mutate: createPortalSession, isPending: isCreatingPortal } = useMutation({
    mutationFn: () => fetchFromApi("/create-portal-session", token, { method: "POST" }),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error("Failed to create portal session:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const renderSubscriptionDetails = () => {
    if (isLoading) {
      return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (error) {
      return (
        <div className="flex items-center space-x-2 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <span>Error loading subscription details.</span>
        </div>
      );
    }

    if (!subscription) {
      return (
        <div>
          <p className="text-jobequal-text-muted dark:text-gray-400">You are currently on the Free plan.</p>
          <Link to="/pricing" className="mt-4 inline-block bg-jobequal-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-jobequal-green-hover transition-colors">
            View Plans
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Plan</span>
          <span className="text-jobequal-text dark:text-white capitalize">{subscription.stripe_price_id} (placeholder)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>{subscription.status}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Current Period End</span>
          <span className="text-jobequal-text dark:text-white">
            {new Date(subscription.current_period_end).toLocaleDateString()}
          </span>
        </div>
        {subscription.cancel_at_period_end && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            Your subscription will be canceled at the end of the current billing period.
          </div>
        )}
        <button
          onClick={() => createPortalSession()}
          disabled={isCreatingPortal}
          className="w-full mt-4 flex items-center justify-center py-3 px-4 border border-transparent text-white bg-gradient-to-r from-jobequal-green to-jobequal-teal rounded-lg font-semibold hover:from-jobequal-green-hover hover:to-jobequal-teal disabled:opacity-50"
        >
          {isCreatingPortal ? <Loader2 className="h-5 w-5 animate-spin" /> : "Manage Subscription"}
          <ExternalLink className="ml-2 h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
          <h1 className="text-3xl font-bold text-jobequal-text dark:text-white mb-6">
            Subscription & Billing
          </h1>
          {renderSubscriptionDetails()}
        </div>
      </div>
    </main>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Navigation } from "@components/Navigation";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Check,
  Users,
  Briefcase,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// Helper function to make authenticated API requests
const fetchFromApi = async (endpoint: string, token: string | undefined, options: RequestInit = {}) => {
  if (!token) {
    // Or handle this case as an error, depending on requirements
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

export default function Pricing() {
  const [activeCategory, setActiveCategory] = useState("job_seekers");
  const { user, session } = useAuth();
  const { t } = useLanguage();
  const token = session?.access_token;

  const { data: products, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchFromApi("/products", token),
    enabled: !!token, // Only run the query if the user is logged in
  });

  const { mutate: createCheckoutSession, isPending: isCreatingCheckout } = useMutation({
    mutationFn: (priceId: string) => fetchFromApi("/create-checkout-session", token, {
      method: "POST",
      body: JSON.stringify({ priceId }),
    }),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error("Failed to create checkout session:", error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubscribe = (priceId: string) => {
    if (!user) {
      window.location.href = "/signin?redirect=/pricing";
      return;
    }
    createCheckoutSession(priceId);
  };

  const categories = [
    { id: "job_seekers", label: "Job Seekers", icon: Users },
    { id: "employers", label: "Employers", icon: Briefcase },
  ];

  const plans = products?.filter((p: any) => p.metadata.category === activeCategory) || [];

  const renderContent = () => {
    if (!user) {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Please sign in to view pricing</h2>
          <p className="mb-6 text-jobequal-text-muted">You need to be logged in to subscribe to a plan.</p>
          <a href="/signin?redirect=/pricing" className="bg-jobequal-green text-white px-6 py-3 rounded-xl font-semibold hover:bg-jobequal-green-hover transition-colors">
            Sign In
          </a>
        </div>
      );
    }

    if (isLoadingProducts) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin" /></div>;
    }

    if (productsError) {
      return <div className="text-center py-10 text-red-500">Error loading pricing plans. Please try again later.</div>;
    }

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan: any, index: number) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 shadow-lg ${
              plan.metadata.popular === 'true'
                ? "border-jobequal-green shadow-2xl scale-105"
                : "border-jobequal-neutral-dark dark:border-gray-600"
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-jobequal-text dark:text-white mb-2">{plan.name}</h3>
              <p className="text-jobequal-text-muted dark:text-gray-400 mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-jobequal-text dark:text-white">
                  CHF {(plan.default_price.unit_amount / 100).toFixed(2)}
                </span>
                <span className="text-jobequal-text-muted dark:text-gray-400">
                  /{plan.default_price.recurring.interval}
                </span>
              </div>
            </div>
            <div className="space-y-3 mb-8">
              {plan.metadata.features?.split(',').map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-jobequal-text dark:text-white text-sm">{feature.trim()}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSubscribe(plan.default_price.id)}
              disabled={isCreatingCheckout}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                plan.metadata.popular === 'true'
                  ? "bg-jobequal-green hover:bg-jobequal-green-hover text-white"
                  : "border border-jobequal-green text-jobequal-green hover:bg-jobequal-green hover:text-white"
              }`}
            >
              {isCreatingCheckout ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Subscribe Now'}
            </button>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-jobequal-text dark:text-white mb-4">
            Transparent Pricing for Everyone
          </h1>
          <p className="text-xl text-jobequal-text-muted dark:text-gray-300 max-w-3xl mx-auto">
            No hidden fees, no surprises. Choose the plan that fits your needs and budget.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 border border-jobequal-neutral-dark dark:border-gray-600 shadow-lg">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? "bg-jobequal-green text-white shadow-lg"
                    : "text-jobequal-text dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {renderContent()}

      </div>
    </main>
  );
}

import { Navigation } from "@components/Navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  DollarSign,
  Server,
  Shield,
  Settings,
  Trash2,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import React, { useState } from "react";

import { useAuth } from "../contexts/AuthContext";
import type { Database } from "@shared/types/supabase";

type Profile = Database["public"]["Tables"]["users"]["Row"];
type Job = Database["public"]["Tables"]["jobs"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];


// Helper function to make authenticated API requests
const fetchFromApi = async <T,>(endpoint: string, token: string | undefined, options: RequestInit = {}): Promise<T> => {
  if (!token) throw new Error("Authentication token not found.");
  const res = await fetch(endpoint, {
    ...options,
    headers: { ...options.headers, "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const errorData = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(errorData.error || "An API error occurred.");
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return res.json();
};


// --- User Management Tab ---

const UserManagementTab = () => {
  const { session } = useAuth();
  const token = session?.access_token;
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery<Profile[]>({
    queryKey: ["adminUsers"],
    queryFn: () => fetchFromApi("/api/admin/users", token),
    enabled: !!token,
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: string }) =>
      fetchFromApi(`/api/admin/users/${userId}`, token, {
        method: "POST",
        body: JSON.stringify({ role }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) =>
      fetchFromApi(`/api/admin/users/${userId}`, token, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      updateUserMutation.mutate({ userId, role: newRole });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (error) return <div className="p-8 text-red-500 flex items-center space-x-2"><AlertCircle /> <span>Error loading users: {error.message}</span></div>;

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
      <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
        User Management ({users?.length || 0})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-jobequal-text dark:text-white">{user.full_name || user.email}</div>
                  <div className="text-sm text-jobequal-text-muted dark:text-gray-400">{user.id}</div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white"
                  >
                    <option value="candidate">Candidate</option>
                    <option value="recruiter">Recruiter</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


// --- Job Management Tab ---

const JobManagementTab = () => {
    const { session } = useAuth();
    const token = session?.access_token;
    const queryClient = useQueryClient();

    const { data: jobs, isLoading, error } = useQuery<Job[]>({
      queryKey: ["adminJobs"],
      queryFn: () => fetchFromApi("/api/admin/jobs", token),
      enabled: !!token,
    });

    const deleteJobMutation = useMutation({
      mutationFn: (jobId: string) =>
        fetchFromApi(`/api/admin/jobs/${jobId}`, token, {
          method: "DELETE",
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminJobs"] });
      },
    });

    const handleDeleteJob = (jobId: string) => {
      if (confirm("Are you sure you want to permanently delete this job posting?")) {
        deleteJobMutation.mutate(jobId);
      }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (error) return <div className="p-8 text-red-500 flex items-center space-x-2"><AlertCircle /> <span>Error loading jobs: {error.message}</span></div>;

    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
        <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
          Job Management ({jobs?.length || 0})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Job Title</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobs?.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-jobequal-text dark:text-white">{job.title}</div>
                    <div className="text-sm text-jobequal-text-muted dark:text-gray-400">{job.id}</div>
                  </td>
                  <td className="px-6 py-4">{job.recruiter_id || 'N/A'}</td>
                  <td className="px-6 py-4">{job.status || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteJob(job.id)} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

// --- Revenue Management Tab ---
const RevenueManagementTab = () => {
    const { session } = useAuth();
    const token = session?.access_token;
    const queryClient = useQueryClient();

    const { data: subscriptions, isLoading, error } = useQuery<Subscription[]>({
        queryKey: ["adminSubscriptions"],
        queryFn: () => fetchFromApi("/api/admin/subscriptions", token),
        enabled: !!token,
    });

    const cancelSubscriptionMutation = useMutation({
        mutationFn: (subscriptionId: string) =>
            fetchFromApi(`/api/admin/subscriptions/${subscriptionId}`, token, {
                method: "POST",
                body: JSON.stringify({ action: "cancel" }),
            }),
        onSuccess: () => {
            alert("Subscription cancelled. The change will be reflected shortly after the webhook is processed.");
            queryClient.invalidateQueries({ queryKey: ["adminSubscriptions"] });
        },
        onError: (err: unknown) => {
            alert(`Failed to cancel subscription: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    });

    const handleCancelSubscription = (subscriptionId: string) => {
        if (confirm("Are you sure you want to cancel this subscription immediately? This action cannot be undone.")) {
            cancelSubscriptionMutation.mutate(subscriptionId);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (error) return <div className="p-8 text-red-500 flex items-center space-x-2"><AlertCircle /> <span>Error loading subscriptions: {error.message}</span></div>;

    return (
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-jobequal-neutral-dark dark:border-gray-600 p-8">
            <h2 className="text-2xl font-bold text-jobequal-text dark:text-white mb-6">
                Subscription Management ({subscriptions?.length || 0})
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Plan ID</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {subscriptions?.map((sub) => (
                            <tr key={sub.id}>
                                <td className="px-6 py-4">{sub.user_id}</td>
                                <td className="px-6 py-4">{sub.plan_id}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleCancelSubscription(sub.stripe_subscription_id ?? "")} className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100">
                                        Cancel Now
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---

export default function OwnerAdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const tabs = [
    { id: "overview", label: "Platform Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "jobs", label: "Job Management", icon: Briefcase },
    { id: "revenue", label: "Revenue & Analytics", icon: DollarSign },
    { id: "system", label: "System Health", icon: Server },
    { id: "security", label: "Security & Logs", icon: Shield },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagementTab />;
      case "jobs":
        return <JobManagementTab />;
      case "revenue":
        return <RevenueManagementTab />;
      default:
        return (
          <div className="p-8 bg-white/90 rounded-2xl border text-center">
            <h3 className="text-xl font-bold">Feature Not Implemented</h3>
            <p className="text-jobequal-text-muted">This section is a work in progress.</p>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-jobequal-neutral via-white to-jobequal-blue dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-jobequal-text dark:text-white">Owner Dashboard</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-jobequal-neutral-dark dark:border-gray-600 p-2 mb-8"
        >
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-jobequal-green text-white shadow-md"
                    : "text-jobequal-text-muted dark:text-gray-400 hover:text-jobequal-text dark:hover:text-white hover:bg-jobequal-neutral dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart3,
  Users,
  Building,
  DollarSign,
  Server,
  Shield,
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

// Helper function to make authenticated API requests
const fetchFromApi = async (endpoint: string, token: string | undefined, options: RequestInit = {}) => {
  if (!token) throw new Error("Authentication token not found.");
  const res = await fetch(endpoint, {
    ...options,
    headers: { ...options.headers, "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "An API error occurred.");
  }
  return res.json();
};


// --- User Management Components ---

const UserManagementTab = () => {
  const { session } = useAuth();
  const token = session?.access_token;
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
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
    <motion.div
      key="users"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
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
              {users?.map((user: any) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-jobequal-text dark:text-white">{user.full_name || user.username}</div>
                    <div className="text-sm text-jobequal-text-muted dark:text-gray-400">{user.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-jobequal-text dark:text-white"
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
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
    </motion.div>
  );
};


// --- Main Dashboard Component ---

export default function OwnerAdminDashboard() {
  const [activeTab, setActiveTab] = useState("users"); // Default to the functional tab

  const tabs = [
    { id: "overview", label: "Platform Overview", icon: BarChart3 },
    { id: "users", label: "User Management", icon: Users },
    { id: "companies", label: "Companies", icon: Building },
    { id: "revenue", label: "Revenue & Analytics", icon: DollarSign },
    { id: "system", label: "System Health", icon: Server },
    { id: "security", label: "Security & Logs", icon: Shield },
    { id: "settings", label: "Platform Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "users":
        return <UserManagementTab />;
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

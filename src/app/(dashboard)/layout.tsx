import React from "react";
import { Navigation } from "@/components/Navigation"; // Assuming a shared nav component

// This is a shared layout for all dashboard pages.
// The (dashboard) directory is a Route Group, so it doesn't affect the URL.
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* We can include a shared navigation bar for all dashboard pages here */}
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
}

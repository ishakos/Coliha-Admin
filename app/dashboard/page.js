"use client";

import { AuthContext } from "@/context/AuthContext";
import { useRedirect } from "../../hooks/useRedirect";
import Dashboard from "@/components/Dashboard/Dashboard";

export default function DashboardPage() {
  const { logged, loading } = AuthContext();
  useRedirect();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <Dashboard />
      ) : (
        <p>Admin not signed in, going home...</p>
      )}
    </>
  );
}

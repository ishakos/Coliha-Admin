"use client";

import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const { logged, loading } = AuthContext();
  useAuth();

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

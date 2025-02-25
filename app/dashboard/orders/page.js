"use client";

import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import Orders from "@/components/Orders";

export default function OrdersPage() {
  const { logged, loading } = AuthContext();

  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <Orders />
      ) : (
        <p>Admin not signed in, going home...</p>
      )}
    </>
  );
}

"use client";

import Orders from "@/components/Dashboard/Orders";
import { AuthContext } from "@/context/AuthContext";
import { useRedirect } from "@/hooks/useRedirect";

export default function OrdersPage() {
  const { logged, loading } = AuthContext();

  useRedirect();

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

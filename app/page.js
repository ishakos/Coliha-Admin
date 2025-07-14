"use client";

import Login from "../components/Login";
import { AuthContext } from "@/context/AuthContext";
import { useRedirect } from "@/hooks/useRedirect";

export default function LoginPage() {
  const { loading, logged } = AuthContext();
  useRedirect();
  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : !logged ? (
        <div className="login">
          LOGIN PAGE ADMIN
          <Login />
        </div>
      ) : (
        <p>Logging in...</p>
      )}
    </>
  );
}

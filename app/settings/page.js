"use client";

import { useAuth } from "../../hooks/useAuth";
import { AuthContext } from "../../context/AuthContext";

export default function SettingsPage() {
  const { logged, loading } = AuthContext();
  useAuth();

  return (
    <>
      {loading ? (
        <p>Loading Screen...</p>
      ) : logged ? (
        <p>Welcome to settings</p>
      ) : (
        <p>Admin not signed in, going home...</p>
      )}
    </>
  );
}

"use client";

import { useRedirect } from "../../hooks/useRedirect";
import { AuthContext } from "../../context/AuthContext";

export default function SettingsPage() {
  const { logged, loading } = AuthContext();
  useRedirect();

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

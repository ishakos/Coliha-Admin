"use client";

import Link from "next/link";
import { AuthContext } from "../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const {
    logged,
    loading,
    setLogged,
    setListOfUsers,
    setOffers,
    setListOfClients,
    setListOfReceipts,
  } = AuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    sessionStorage.removeItem("accessTokenAdmin");
    setLogged(false);
    setListOfUsers([]);
    setOffers([]);
    setListOfClients([]);
    setListOfReceipts([]);
    router.push("/");
  };

  const headerItem = () => {
    if (loading) {
      return <header>Loading header...</header>;
    } else {
    }
    switch (pathname) {
      case "/":
        return (
          <header>
            <p>Admin Pannel</p>
            <p>header</p>
            <p>Fill your infos</p>
          </header>
        );
      case "/settings":
      case "/dashboard":
      case "/dashboard/orders":
        if (logged) {
          return (
            <header>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/dashboard/orders">Orders</Link>
              <Link href="/settings">Settings</Link>
              <Link href="/" onClick={logout}>
                Logout
              </Link>
            </header>
          );
        } else {
          return (
            <header>
              <p>Admin Pannel</p>
              <p>header</p>
              <p>Logging out...</p>
            </header>
          );
        }
      case "/unwanted-page":
        return (
          <header>
            <Link href={"/"}>Go home</Link>
            <p>header</p>
            <p>Error Page</p>
          </header>
        );
        break;
      default:
        return <></>;
    }
  };

  return <>{headerItem()}</>;
}

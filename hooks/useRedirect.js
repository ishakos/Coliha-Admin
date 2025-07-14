import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export function useRedirect() {
  const { logged, loading } = AuthContext();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      switch (pathname) {
        case "/":
          if (logged) {
            router.push("/dashboard");
          }
          break;
        case "/settings":
        case "/dashboard":
        case "/dashboard/orders":
          if (!logged) {
            router.push("/");
          }
          break;
        default:
      }
    }
  }, [logged, loading]);
}

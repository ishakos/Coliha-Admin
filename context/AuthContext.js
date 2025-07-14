"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const AuthCtx = createContext();

export function AuthProvider({ children }) {
  //context1
  const [logged, setLogged] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [listOfClients, setListOfClients] = useState([]);
  const [listOfReceipts, setListOfReceipts] = useState([]);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const domain = "http://localhost:3001";
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
    setLogged(false);
    setLoading(false);
    sessionStorage.removeItem("accessTokenAdmin");
  };

  const handleLogin = () => {
    setLogged(true);
    setLoading(false);
  };

  useEffect(() => {
    let clients = [];

    setLoading(true);
    setLogged(false);

    const checkAdmin = async () => {
      const token = sessionStorage.getItem("accessTokenAdmin");
      if (!token) {
        handleLogout();
        return;
      }
      await fetchUsers();
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${domain}/admins/users`, {
          headers: {
            accessTokenAdmin: sessionStorage.getItem("accessTokenAdmin") || "",
          },
        });
        setListOfUsers(response.data.users);
        await fetchOffers();
      } catch (error) {
        if (error?.response?.status === 401) {
          handleLogout();
          return;
        } else {
          console.error(error);
        }
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${domain}/subscribers`);
        setOffers(response.data.offers);
        await fetchClients();
      } catch (error) {
        if (error?.response?.status === 401) {
          handleLogout();
          return;
        } else {
          console.error(error);
        }
      }
    };

    //Fetch clients who purchased a subscription request and their receipts
    const fetchClients = async () => {
      try {
        const response = await axios.get(
          `${domain}/admins/pending-sub-requests`,
          {
            headers: {
              accessTokenAdmin:
                sessionStorage.getItem("accessTokenAdmin") || "",
            },
          }
        );
        setListOfClients(response.data.clients);
        clients = response.data.clients;
        await fetchReceipts(clients);
      } catch (error) {
        if (error?.response?.status === 401) {
          handleLogout();
          return;
        } else {
          console.error(error);
        }
      }
    };

    const fetchReceipts = async (clients) => {
      try {
        let receipts = [];
        //if there is no clients no need to fetch receipts
        if (clients.length > 0) {
          const receiptPromises = clients.map(async (client) => {
            const imageRef = ref(storage, `${client._id}/orders/receipt`);
            try {
              const url = await getDownloadURL(imageRef);
              receipts.push(url);
            } catch (error) {
              console.error(error);
            }
          });
          await Promise.all(receiptPromises);
        }
        setReceiptsLoading(false);
        setListOfReceipts(receipts);
        handleLogin();
      } catch (error) {
        console.error(error);
      }
    };

    checkAdmin();
  }, [refresh]);

  return (
    <AuthCtx.Provider
      value={{
        logged,
        setLogged,
        loading,
        setLoading,
        domain,
        listOfUsers,
        setListOfUsers,
        offers,
        setOffers,
        listOfClients,
        setListOfClients,
        listOfReceipts,
        setListOfReceipts,
        receiptsLoading,
        setReceiptsLoading,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export function AuthContext() {
  return useContext(AuthCtx);
}

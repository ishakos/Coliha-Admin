"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";

const AuthCtx = createContext();
const ReceiptsCtx = createContext();

export function AuthProvider({ children }) {
  //context1
  const [logged, setLogged] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listOfUsers, setListOfUsers] = useState([]);
  const [offers, setOffers] = useState([]);
  //context2
  const [listOfOrders, setListOfOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [listOfReceipts, setListOfReceipts] = useState([]);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const domain = "http://localhost:3001";

  //context1
  //no dependency array might be a good solution here
  useEffect(() => {
    //check admin
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem("accessTokenAdmin");
        if (!token) {
          setLogged(false);
          setLoading(false);
          return;
        } else {
          axios
            .get(`${domain}/admins/auth`, {
              headers: { accessTokenAdmin: token || "" },
            })
            .then((response) => {
              if (response.data.noToken) {
                router.push("/unwanted-page");
                sessionStorage.clear();
                localStorage.clear();
              }
              if (response.data.authentificated) {
                setLoading(false);
                setLogged(true);
              } else {
                setLogged(false);
                setLoading(false);
                return;
              }
            });
          await fetchUsers();
        }
      } catch (error) {
        setLogged(false);
        setLoading(false);
        console.error("Error fetching token");
        router.push("/unwanted-page");
      }
    };

    const fetchUsers = async () => {
      try {
        axios
          .get(`${domain}/admins/users`, {
            headers: {
              accessTokenAdmin: localStorage.getItem("accessTokenAdmin") || "",
            },
          })
          .then((response) => {
            if (response.data.noToken) {
              router.push("/unwanted-page");
              sessionStorage.clear();
              localStorage.clear();
            }
            if (!response.data.error) {
              setListOfUsers(response.data.users);
            } else {
              setLoading(false);
              console.error("Error fetching users");
              router.push("/unwanted-page");
              return;
            }
          });
        await fetchOffers();
      } catch (error) {
        console.error("Error fetching users");
        router.push("/unwanted-page");
      }
    };

    const fetchOffers = async () => {
      try {
        axios.get(`${domain}/subscribers`).then((response) => {
          if (!response.data.error) {
            setOffers(response.data.offers);
          } else {
            setLoading(false);
            console.error("Error fetching offers");
            router.push("/unwanted-page");
            return;
          }
        });
      } catch (error) {
        console.error("Error fetching offers");
        router.push("/unwanted-page");
      }
    };

    checkAdmin();
  }, [pathname]);

  //context2
  //fetch orders and receipts
  useEffect(() => {
    let orders = [];
    const fetchOrdersAndReceipts = async () => {
      try {
        axios
          .get(`${domain}/admins/orders`, {
            headers: {
              accessTokenAdmin: localStorage.getItem("accessTokenAdmin") || "",
            },
          })
          .then((response) => {
            if (response.data.noToken) {
              router.push("/unwanted-page");
              sessionStorage.clear();
              localStorage.clear();
            }
            if (!response.data.error) {
              setListOfOrders(response.data.orders);
              setOrdersLoading(false);
              orders = response.data.orders;
              fetchReceipts(orders);
            } else {
              console.error("error fetching orders");
              router.push("/unwanted-page");
            }
          });
      } catch (error) {
        console.error("error fetching orders and receipts");
        router.push("/unwanted-page");
      }
    };

    const fetchReceipts = (orders) => {
      try {
        let receipts = [];
        if (orders.length > 0) {
          orders.map((order) => {
            const imageRef = ref(storage, `${order._id}/orders/receipt`);
            getDownloadURL(imageRef)
              .then((url) => {
                receipts.push(url);
                setListOfReceipts(receipts);
              })
              .catch(() => {
                console.error("error fetching receipts");
                router.push("/unwanted-page");
              });
          });
        }
      } catch (error) {
        console.error("error fetching orders");
        router.push("/unwanted-page");
      }
    };
    fetchOrdersAndReceipts();
  }, [pathname]);

  useEffect(() => {
    if (
      listOfReceipts.length === listOfOrders.length &&
      listOfOrders.length > 0
    ) {
      setReceiptsLoading(false);
    }
  }, [listOfReceipts]);

  return (
    <AuthCtx.Provider
      value={{
        logged,
        loading,
        domain,
        listOfUsers,
        setListOfUsers,
        offers,
      }}
    >
      <ReceiptsCtx.Provider
        value={{
          listOfOrders,
          setListOfOrders,
          ordersLoading,
          listOfReceipts,
          receiptsLoading,
        }}
      >
        {children}
      </ReceiptsCtx.Provider>
    </AuthCtx.Provider>
  );
}

export function AuthContext() {
  return useContext(AuthCtx);
}

export function ReceiptsContext() {
  return useContext(ReceiptsCtx);
}

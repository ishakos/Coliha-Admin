import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react";
import { ref, getMetadata, deleteObject } from "firebase/storage";
import { storage } from "../../firebase";
import { useRouter } from "next/navigation";

export default function Orders() {
  const [sendingRequest, setSendingRequest] = useState(false);
  const router = useRouter();
  const {
    domain,
    listOfReceipts,
    receiptsLoading,
    listOfClients,
    setListOfReceipts,
    setListOfClients,
    setOffers,
    setListOfUsers,
    setLogged,
  } = AuthContext();

  const handleLogout = () => {
    sessionStorage.removeItem("accessTokenAdmin");
    setLogged(false);
    setListOfUsers([]);
    setOffers([]);
    setListOfClients([]);
    setListOfReceipts([]);
    router.push("/unwanted-page");
  };

  const containerStyles = {
    opacity: sendingRequest ? 0.6 : 1,
    pointerEvents: sendingRequest ? "none" : "auto",
  };

  const handleAcceptReceipt = async (userId) => {
    const confirmed = window.confirm("Accept receipt?");
    if (confirmed) {
      setSendingRequest(true);
      const config = {
        headers: {
          accessTokenAdmin: sessionStorage.getItem("accessTokenAdmin") || "",
        },
      };
      try {
        const response = await axios.post(
          `${domain}/admins/accept-receipt`,
          { userId: userId },
          config
        );
        const storageRef = ref(storage, `${userId}/orders`);
        try {
          await getMetadata(storageRef);
          await deleteObject(storageRef);
        } catch {
          //no worries cuz if user upload another receipt it will override
        }
        try {
          const ordersResponse = await axios.get(
            `${domain}/admins/orders`,
            config
          );
          setListOfClients(ordersResponse?.data?.orders || []);
        } catch {
        } finally {
          alert("Receipt accepted");
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          if (error?.response?.data?.noUser) {
            alert("This user does not exist");
          } else if (error?.response?.data?.noOffer) {
            alert("Unknown offer requested");
          } else {
            alert("Error: Not found");
          }
        } else if (error?.response?.status === 401) {
          handleLogout();
        } else {
          alert("Error, try again");
        }
      } finally {
        setSendingRequest(false);
      }
    }
  };

  const handleRefuseReceipt = async (userId) => {
    const confirmed = window.confirm("Refuse receipt?");
    if (confirmed) {
      setSendingRequest(true);
      const data = {
        userId: userId,
      };
      const config = {
        headers: {
          accessTokenAdmin: sessionStorage.getItem("accessTokenAdmin") || "",
        },
      };
      try {
        const response = await axios.post(
          `${domain}/admins/refuse-receipt`,
          { userId: userId },
          config
        );
        const storageRef = ref(storage, `${userId}/orders`);
        try {
          await getMetadata(storageRef);
          await deleteObject(storageRef);
        } catch {
          //no worries cuz if user upload another receipt it will override
        }
        try {
          const ordersResponse = await axios.get(
            `${domain}/admins/orders`,
            config
          );
          setListOfClients(ordersResponse?.data?.orders || []);
        } catch {
        } finally {
          alert("Receipt refused");
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          alert("This user does not exist.");
        } else if (error?.response?.status === 401) {
          handleLogout();
        } else {
          alert("Error, try again");
        }
      } finally {
        setSendingRequest(false);
      }
    }
  };

  return (
    <>
      <p>welcome to orders</p>
      <div className="dashboard">
        <p>username</p>
        <p>Offer wanted</p>
        <p>Receipt</p>
      </div>
      {listOfClients?.length > 0 ? (
        <>
          <div className="container" style={containerStyles}>
            {listOfClients?.map((order, index) => (
              <div className="line" key={index}>
                <p>{order?.username}</p>
                <p>{order?.offerRequested}</p>
                {receiptsLoading ? (
                  <>receiptsLoading...</>
                ) : (
                  <>
                    <img src={listOfReceipts?.[index]} alt="Receipt" />
                    <a
                      style={{ display: "Block" }}
                      href={listOfReceipts?.[index]}
                      target="_blank"
                    >
                      See Receipt
                    </a>
                    <button
                      onClick={() => {
                        handleAcceptReceipt(order?._id);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleRefuseReceipt(order?._id);
                      }}
                    >
                      Refuse
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>There is no orders</p>
      )}
    </>
  );
}

import { AuthContext, ReceiptsContext } from "@/context/AuthContext";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";

export default function Orders() {
  const [sendingRequest, setSendingRequest] = useState(false);
  const { domain } = AuthContext();
  const {
    listOfOrders,
    ordersLoading,
    listOfReceipts,
    receiptsLoading,
    setListOfOrders,
  } = ReceiptsContext();

  const containerStyles = {
    opacity: sendingRequest ? 0.6 : 1,
    pointerEvents: sendingRequest ? "none" : "auto",
  };

  const handleAcceptReceipt = (userId) => {
    const confirmed = window.confirm("Accept receipt?");
    if (confirmed) {
      setSendingRequest(true);
      const data = {
        userId: userId,
      };
      const config = {
        headers: {
          accessTokenAdmin: localStorage.getItem("accessTokenAdmin") || "",
        },
      };
      axios
        .post(`${domain}/admins/acceptreceipt`, data, config)
        .then((response) => {
          if (response.data.noToken) {
            router.push("/unwanted-page");
            sessionStorage.clear();
            localStorage.clear();
          }
          if (response.data.error) {
            alert(response.data.error);
            setSendingRequest(false);
          } else {
            const storageRef = ref(storage, `${userId}/orders`);
            getMetadata(storageRef)
              .then(() => {
                deleteObject(storageRef);
              })
              .catch((error) => {
                window.location.reload();
              });
            axios.get(`${domain}/admins/orders`, config).then((response) => {
              if (!response.data.error) {
                setListOfOrders(response.data.orders);
                alert("Receipt accepted");
                setSendingRequest(false);
              } else {
                window.location.reload();
              }
            });
          }
        });
    }
  };

  const handleRefuseReceipt = (userId) => {
    const confirmed = window.confirm("Refuse receipt?");
    if (confirmed) {
      setSendingRequest(true);
      const data = {
        userId: userId,
      };
      const config = {
        headers: {
          accessTokenAdmin: localStorage.getItem("accessTokenAdmin") || "",
        },
      };
      axios
        .post(`${domain}/admins/refusereceipt`, data, config)
        .then((response) => {
          if (response.data.noToken) {
            router.push("/unwanted-page");
            sessionStorage.clear();
            localStorage.clear();
          }
          if (response.data.error) {
            alert(response.data.error);
            setSendingRequest(false);
          } else {
            const storageRef = ref(storage, `${userId}/orders`);
            getMetadata(storageRef)
              .then(() => {
                deleteObject(storageRef);
              })
              .catch((error) => {
                window.location.reload();
              });
            axios.get(`${domain}/admins/orders`, config).then((response) => {
              if (!response.data.error) {
                setListOfOrders(response.data.orders);
                alert("Receipt refused");
                setSendingRequest(false);
              } else {
                window.location.reload();
              }
            });
          }
        });
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
      {ordersLoading ? (
        <p>Orders loading....</p>
      ) : listOfOrders.length > 0 ? (
        <>
          <div className="container" style={containerStyles}>
            {listOfOrders.map((order, index) => (
              <div className="line" key={index}>
                <p>{order.username}</p>
                <p>{order.offerRequested}</p>
                {receiptsLoading ? (
                  <>receiptsLoading...</>
                ) : (
                  <>
                    <img src={listOfReceipts[index]} alt="Receipt" />
                    <a
                      style={{ display: "Block" }}
                      href={listOfReceipts[index]}
                      target="_blank"
                    >
                      See Receipt
                    </a>
                    <button
                      onClick={() => {
                        handleAcceptReceipt(order._id);
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => {
                        handleRefuseReceipt(order._id);
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

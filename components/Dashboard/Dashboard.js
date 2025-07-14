import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react";
import { ref, getMetadata, deleteObject } from "firebase/storage";
import { storage } from "../../firebase";

export default function Dashboard() {
  const [sendingRequest, setSendingRequest] = useState(false);
  const { domain, listOfUsers, offers, setListOfUsers } = AuthContext();

  const containerStyles = {
    opacity: sendingRequest ? 0.6 : 1,
    pointerEvents: sendingRequest ? "none" : "auto",
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessTokenAdmin");
    setLogged(false);
    setListOfUsers([]);
    setOffers([]);
    setListOfClients([]);
    setListOfReceipts([]);
    router.push("/unwanted-page");
  };

  function searchOfferName(offerId) {
    if (!offerId) return "user has no offer";
    for (let i = 0; i < offers?.length; i++) {
      if (offers?.[i]?._id === offerId) {
        return offers?.[i]?.title;
      }
    }
    return "user has no offer";
  }

  //delete account
  const onDeleteUser = async (user) => {
    if (!user) return;
    setSendingRequest(true);
    const storageRef = ref(storage, `${user?._id}/`);
    try {
      const response = await axios.post(
        `${domain}/admins/delete-account/${user?._id}`,
        {
          headers: {
            accessTokenAdmin: sessionStorage.getItem("accessTokenAdmin") || "",
          },
        }
      );
      //deleting user pfp
      try {
        await getMetadata(storageRef);
        await deleteObject(storageRef);
      } catch {}
      //ui re-render
      const updatedList = listOfUsers?.filter((u) => u?.id !== user?.id);
      setListOfUsers(updatedList);
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      } else {
        alert("Error deleting user. Please try again.");
      }
    } finally {
      setSendingRequest(false);
    }
  };

  //save new modified data
  // ◘ FOR LATER
  const onSave = async (currentUsername, newUsername, selectedNewOffer) => {
    return;
  };

  return (
    <>
      <p>Welcome to Dashboard</p>
      <div className="dashboard">
        <p>id</p>
        <p>username</p>
        <p>email</p>
        <p>vrf</p>
        <p>prflPic</p>
        <p>pfp</p>
        <p>2ndEVR</p>
        <p>offer</p>
        <p>D-created</p>
      </div>
      {!listOfUsers ? (
        <>No users</>
      ) : (
        <div className="container" style={containerStyles}>
          {listOfUsers?.map((user, index) => {
            return (
              <User
                user={user}
                key={index}
                onDeleteUser={onDeleteUser}
                onSave={onSave}
                searchOfferName={searchOfferName}
                offers={offers}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

function User({ user, index, onDeleteUser, onSave, searchOfferName, offers }) {
  const [edit, setEdit] = useState(false);
  const [username, setUsername] = useState(user?.username);
  const [selectedNewOffer, setSelectedNewOffer] = useState(null);

  return (
    <div className="line" key={index}>
      <p>{user?._id}</p>
      {edit ? (
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
      ) : (
        <p>{user?.username}</p>
      )}
      <p>{user?.email}</p>
      <p>{user?.verified ? "Verified" : "Not Verified"}</p>
      <p>{user?.profilePic?.substring(0, 30) + "..."}</p>
      <p>{user?.pfp ? "true" : "false"}</p>
      <p>{user?.secondEVR ? "True" : "False"}</p>
      {edit ? (
        <>
          <label key={0}>
            <input
              type="radio"
              name="option"
              checked={selectedNewOffer === "noOffer"}
              onChange={() => setSelectedNewOffer("noOffer")}
            />
            noOffer
          </label>
          {offers?.slice(1).map((offer, index) => (
            <label key={index + 1}>
              <input
                type="radio"
                name="option"
                checked={selectedNewOffer === offer?.title}
                onChange={() => setSelectedNewOffer(offer?.title)}
              />
              {offer?.title}
            </label>
          ))}
          <button
            onClick={() => {
              setSelectedNewOffer(null);
            }}
          >
            Reset Offer
          </button>
        </>
      ) : (
        <p>{searchOfferName(user?.purchasedOffer?.offer)}</p>
      )}
      <p>{user?.createdAt}</p>
      <button
        onClick={() => {
          setEdit((edit) => !edit);
          setUsername(user?.username);
          setSelectedNewOffer(null);
        }}
      >
        {edit ? "Cancel" : "Edit"}
      </button>
      <>
        {edit ? (
          <>
            <button
              onClick={() => {
                onSave(user?.username, username, selectedNewOffer);
                setEdit(false);
              }}
            >
              Save
            </button>
          </>
        ) : (
          <DeleteUserButton onDeleteUser={onDeleteUser} user={user} />
        )}
      </>
    </div>
  );
}

function DeleteUserButton({ onDeleteUser, user }) {
  const [deleteUser, setDeleteUser] = useState(false);
  return (
    <>
      {deleteUser ? (
        <>
          <button onClick={() => setDeleteUser((deleteUser) => !deleteUser)}>
            Cancel Delete
          </button>
          <button
            onClick={() => {
              onDeleteUser(user);
            }}
          >
            Confirm Delete
          </button>
        </>
      ) : (
        <button onClick={() => setDeleteUser(() => true)}>Delete User</button>
      )}
    </>
  );
}

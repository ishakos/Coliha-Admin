import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useState } from "react";
import { ref, getMetadata, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

export default function Dashboard() {
  const [sendingRequest, setSendingRequest] = useState(false);
  const { domain, listOfUsers, offers, setListOfUsers } = AuthContext();

  const containerStyles = {
    opacity: sendingRequest ? 0.6 : 1,
    pointerEvents: sendingRequest ? "none" : "auto",
  };

  function searchOfferName(offerId) {
    if (!offerId) return "user has no offer";
    for (let i = 0; i < offers?.length; i++) {
      if (offers[i]?._id === offerId) {
        return offers[i].title;
      }
    }
    return "user has no offer";
  }

  //delete account
  const onDeleteUser = (user) => {
    if (!user) return;
    setSendingRequest(true);
    const storageRef = ref(storage, `${user._id}/`);
    axios
      .post(
        `${domain}/admins/deleteaccount/`,
        { id: user.id },
        {
          headers: {
            accessTokenAdmin: localStorage.getItem("accessTokenAdmin") || "",
          },
        }
      )
      .then((response) => {
        if (response.data.noToken) {
          router.push("/unwanted-page");
          sessionStorage.clear();
          localStorage.clear();
        }
        if (response.data.deleted) {
          //deleting user pfp
          getMetadata(storageRef)
            .then(() => {
              deleteObject(storageRef);
            })
            .catch(() => {});
          //ui re-render
          const updatedList = listOfUsers.filter((user) => user.id !== user.id);
          setListOfUsers(updatedList);
          setSendingRequest(false);
        } else {
          alert(response.data.error);
          setSendingRequest(false);
        }
      });
  };

  //save new modified data
  const onSave = (currentUsername, newUsername, selectedNewOffer) => {
    if (currentUsername === newUsername && !selectedNewOffer) return;
    setSendingRequest(true);
    axios
      .post(
        `${domain}/admins/updateuser/`,
        {
          currentUsername: currentUsername,
          newUsername: newUsername,
          selectedNewOffer: selectedNewOffer,
        },
        {
          headers: {
            accessTokenAdmin: localStorage.getItem("accessTokenAdmin") || "",
          },
        }
      )
      .then((response) => {
        if (response.data.noToken) {
          router.push("/unwanted-page");
          sessionStorage.clear();
          localStorage.clear();
        }
        if (response.data.updated) {
          axios
            .get(`${domain}/admins/users`, {
              headers: {
                accessTokenAdmin:
                  localStorage.getItem("accessTokenAdmin") || "",
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
                window.location.reload();
              }
              setSendingRequest(false);
              alert(`${currentUsername} Updated`);
            });
        } else {
          alert(response.data.error);
          setSendingRequest(false);
        }
      });
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
  const [username, setUsername] = useState(user.username);
  const [selectedNewOffer, setSelectedNewOffer] = useState(null);

  return (
    <div className="line" key={index}>
      <p>{user._id}</p>
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
        <p>{user.username}</p>
      )}
      <p>{user.email}</p>
      <p>{user.verified ? "Verified" : "Not Verified"}</p>
      <p>{user.profilePic.substring(0, 30) + "..."}</p>
      <p>{user.pfp ? "true" : "false"}</p>
      <p>{user.secondEVR ? "True" : "False"}</p>
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
          {offers.slice(1).map((offer, index) => (
            <label key={index + 1}>
              <input
                type="radio"
                name="option"
                checked={selectedNewOffer === offer.title}
                onChange={() => setSelectedNewOffer(offer.title)}
              />
              {offer.title}
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
        <p>{searchOfferName(user.purchasedOffer.offer)}</p>
      )}
      <p>{user.createdAt}</p>
      <button
        onClick={() => {
          setEdit((edit) => !edit);
          setUsername(user.username);
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
                onSave(user.username, username, selectedNewOffer);
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

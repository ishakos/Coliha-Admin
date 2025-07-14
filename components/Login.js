"use client";

import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error1, setError1] = useState(false);
  const [error2, setError2] = useState(false);
  const router = useRouter();
  const { domain, setRefresh } = AuthContext();

  const login = async () => {
    const data = { username: username, password: password };
    if (!username) {
      setError1(true);
      return;
    }
    if (!password) {
      setError2(true);
      return;
    }
    try {
      const response = await axios.post(`${domain}/admins/login/`, data);
      sessionStorage.setItem("accessTokenAdmin", response.data);
      setRefresh((prev) => !prev);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (error.response.data && error.response.data.noAdmin) {
          setError1(true);
        } else if (error.response.data && error.response.data.wrongPass) {
          setError2(true);
        } else {
          toast.error("An error occurred during login. Please try again.");
        }
      } else {
        toast.error("An error occurred during login. Please try again.");
      }
    }
  };

  return (
    <LoginForm
      login={login}
      error1={error1}
      error2={error2}
      setError1={setError1}
      setError2={setError2}
      setPassword={setPassword}
      setUsername={setUsername}
    />
  );
}

function LoginForm({
  login,
  setPassword,
  setUsername,
  error1,
  error2,
  setError1,
  setError2,
}) {
  return (
    <div>
      <Hint1 error1={error1} />
      <input
        type="text"
        placeholder="username"
        onSelect={() => {
          setError1(() => !true);
          setError2(() => !true);
        }}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <Hint2 error2={error2} />
      <input
        type="password"
        placeholder="password"
        onSelect={() => {
          setError1(() => !true);
          setError2(() => !true);
        }}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button type="submit" onClick={login}>
        Login
      </button>
    </div>
  );
}

function Hint1({ error1 }) {
  return <>{error1 ? <span>Admin Does Not Exist</span> : <></>}</>;
}

function Hint2({ error2 }) {
  return <>{error2 ? <span>Wrong Password</span> : <></>}</>;
}

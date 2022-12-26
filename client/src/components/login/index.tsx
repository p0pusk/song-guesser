import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./login.css";
import authContext from "../../authContext";
import { fetchUserData } from "../../utils/utils";
import socketService from "../../services/socketService";
import gameContext from "../../gameContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const { setLogin, setAvatar } = useContext(authContext);
  const { isInRoom, setInRoom } = useContext(gameContext);
  const navigate = useNavigate();

  const updateAuth = async () => {
    if (!user) return;

    const data = await fetchUserData(user.uid);
    console.log(data);
    setLogin(data?.login);
    setAvatar(data?.avatar);
  };

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (isInRoom) {
      socketService.leave_room();
      setInRoom(false);
    }
    if (user) {
      navigate("/home");
      try {
        updateAuth();
        socketService.connect("http://localhost:8000", user.uid);
      } catch (e) {
        alert(e);
      }
    }
  }, [user, loading]);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Login;

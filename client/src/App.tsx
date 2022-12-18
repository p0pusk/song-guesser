import { useContext, useEffect, useState } from "react";
import {
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import socketService from "./services/socketService";
import { Game } from "./components/game";
import { Home } from "./components/home";
import gameService from "./services/gameService";
import GameContext, { IGameContextProps } from "./gameContext";
import AuthContext, { IAuthContextProps } from "./authContext";
import Login from "./components/login";
import Register from "./components/register";
import Reset from "./components/reset";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { log } from "console";
import { fetchUserData } from "./utils/utils";
import { JoinRoom } from "./components/joinRoom";

function App() {
  const location = useLocation();

  const [isJoining, setJoining] = useState(false);
  const [isInRoom, setInRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [players, setPlayers] = useState(
    new Array<{ id: string; login: string; avatar: File | null }>()
  );
  const [isAuth, setAuth] = useState(false);
  const [login, setLogin] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [user, loading, error] = useAuthState(auth);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    roomId,
    setRoomId,
    players,
    setPlayers,
  };

  const authContextValue: IAuthContextProps = {
    isAuth,
    setAuth,
    login,
    setLogin,
    avatar,
    setAvatar,
  };

  const navigation = useNavigate();

  useEffect(() => {
    const roomId = location.pathname.substring(1).trim();

    if (!user) {
      navigation("/");
    } else if (roomId.includes("lobby=")) {
      const socket = socketService.socket;
      if (!socket) return;

      setJoining(true);
      gameService.checkGameRoom(socket, roomId).then((value) => {
        if (value) {
          gameService
            .joinGameRoom(socket, roomId)
            .then(() => {
              setRoomId(roomId);
              navigation(location.pathname);
              return;
            })
            .catch((err) => alert(err));
        } else {
          alert("Lobby doesn't exist");
          navigation("/home");
        }
        setJoining(false);
      });
    } else navigation("/");
  }, []);

  return (
    <>
      <GameContext.Provider value={gameContextValue}>
        <AuthContext.Provider value={authContextValue}>
          <Routes>
            <Route path="/lobby=:lobbyID" element={<Game />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/join" element={<JoinRoom />} />
          </Routes>
        </AuthContext.Provider>
      </GameContext.Provider>
    </>
  );
}

export default App;

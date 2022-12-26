import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { Game } from "./components/game";
import { Home } from "./components/home";
import GameContext, { IGameContextProps } from "./gameContext";
import AuthContext, { IAuthContextProps } from "./authContext";
import Login from "./components/login";
import Register from "./components/register";
import Reset from "./components/reset";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { JoinRoom } from "./components/joinRoom";
import socketService from "./services/socketService";

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [isInGame, setInGame] = useState(false);
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
    isInGame,
    setInGame,
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
    if (!user) {
      navigation("/");
    }
    if (isInRoom) {
      socketService.leave_room();
      setInRoom(false);
    }
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

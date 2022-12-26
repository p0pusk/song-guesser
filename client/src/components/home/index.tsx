import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketService from "../../services/socketService";
import gameService from "../../services/gameService";
import gameContext from "../../gameContext";
import authContext from "../../authContext";
import { auth, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function Home() {
  const [isJoining, setJoining] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const { isInRoom, setInRoom, setRoomId } = useContext(gameContext);
  const { login, setLogin, avatar } = useContext(authContext);
  const navigate = useNavigate();

  const createLobby = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate("/");

    const socket = socketService.socket;
    if (!socket) return;

    setJoining(true);

    const joined = await gameService
      .createGameRoom(socket, {
        roomId: `lobby=${user.uid}`,
        userId: user.uid,
      })
      .catch((err) => {
        alert(err);
      });

    if (joined) {
      setInRoom(true);
      navigate(`/lobby=${user.uid}`);
    }

    setJoining(false);
    setRoomId(`lobby=${user.uid}`);
  };

  useEffect(() => {
    if (loading) return;
    if (isInRoom) {
      socketService.leave_room();
      setInRoom(false);
    }
    if (!user) return navigate("/");
  }, [user, loading]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Song-guesser game</h1>
        <h3>Username: {login ? login : "..."}</h3>
        <button className="App-button" onClick={createLobby}>
          {!isJoining ? "Create lobby" : "Creating lobby..."}
        </button>
        <button className="App-button" onClick={() => navigate("/join")}>
          Join lobby
        </button>
        <button
          className="App-button"
          onClick={() => {
            logout();
            socketService.disconnect();
          }}
        >
          Logout
        </button>
      </header>
    </div>
  );
}

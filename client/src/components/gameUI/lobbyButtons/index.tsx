import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import gameContext from "../../../gameContext";
import lobbyContext from "../../../lobbyContext";
import socketService from "../../../services/socketService";

export function LobbyButtons() {
  const { roomId, isInGame, setInGame } = useContext(gameContext);
  const { players, hostId, isListening, setListening } =
    useContext(lobbyContext);
  const [user] = useAuthState(auth);

  const navigation = useNavigate();

  const isHost = (): boolean => {
    if (!user || !roomId) return false;
    return roomId.includes(user.uid);
  };

  const startGame = () => {
    socketService?.socket?.emit("start_game");
  };

  return (
    <>
      <button
        className="App-button"
        onClick={() => navigator.clipboard.writeText(roomId ? roomId : "")}
      >
        Copy room token
      </button>
      <button
        className="App-button"
        onClick={startGame}
        hidden={!(isHost() && players && players.length > 1)}
      >
        Start
      </button>
      <button
        className="App-button"
        onClick={() => {
          socketService.socket?.emit("leave_room");
          navigation("/home");
        }}
      >
        Exit
      </button>
    </>
  );
}

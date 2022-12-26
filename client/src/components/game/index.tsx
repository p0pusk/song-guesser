import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import authContext from "../../authContext";
import { auth, db } from "../../firebase";
import gameContext from "../../gameContext";
import gameService, { UserData } from "../../services/gameService";
import socketService from "../../services/socketService";

export function Game() {
  const navigation = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const { roomId } = useContext(gameContext);
  const [players, setPlayers] = useState<UserData[]>();
  const { isAuth, login, avatar } = useContext(authContext);
  const [lobbyPlayers, setLobbyPlayers] = useState([null]);

  const updatePlayers = async () => {
    if (!socketService.socket || !roomId) return;
    const res = await gameService
      .getRoomClients(socketService.socket, roomId)
      .catch((err) => alert(err));

    if (res) {
      setPlayers(res);
    }

    gameService.onNewPlayer(socketService.socket, () => {
      console.log("new player");
      updatePlayers();
    });

    gameService.onGameStarted(socketService.socket, () => {
      alert("Game started");
      console.log("kkes");
      updatePlayers();
    });

    gameService.onPlayerLeave(socketService.socket, () => {
      console.log("player left");
      updatePlayers();
    });
  };

  useEffect(() => {
    if (!socketService.socket) return;
    if (!user) {
      navigation("/");
      return;
    }

    updatePlayers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {players?.map((value) => {
            return <h4 key={value.uid}>player: {value.name}</h4>;
          })}
        </div>
        {!gameService.started ? (
          <>
            <button
              className="App-button"
              onClick={() =>
                navigator.clipboard.writeText(roomId ? roomId : "")
              }
            >
              Copy room token
            </button>
            <button
              className="App-button"
              onClick={() => socketService.socket?.emit("start_game")}
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
        ) : (
          <></>
        )}
      </header>
    </div>
  );
}

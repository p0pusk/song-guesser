import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import authContext from "../../authContext";
import { auth, db } from "../../firebase";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import { fetchUserData } from "../../utils/utils";

export function Game() {
  const location = useLocation();
  const navigation = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const { players, setPlayers, roomId } = useContext(gameContext);
  const { isAuth, login, avatar } = useContext(authContext);
  const [lobbyPlayers, setLobbyPlayers] = useState([null]);

  const updatePlayers = async () => {
    if (!socketService.socket || !roomId) return;
    const res = await gameService
      .getRoomClients(socketService.socket, roomId)
      .catch((err) => alert(err));
    console.log(res);

    const new_players = players;

    res?.forEach(async (id: string) => {
      const data = await fetchUserData(id);
      const search = players.find((value) => {
        return value.id === id;
      });
      if (search) {
        search.login = data.login;
        search.avatar = data.avatar;
      } else {
        new_players.push({ id: id, login: data.login, avatar: data.avatar });
      }
    });

    setPlayers(new_players);

    socketService.socket.on("new_player", async (message: any) => {
      console.log("new player");
      const new_players = players;
      const data = await fetchUserData(message.userId);
      const search = players.find((value) => {
        return value.id === message.userId;
      });
      if (search) {
        search.login = data.login;
        search.avatar = data.avatar;
      } else {
        new_players.push({
          id: message.userId,
          login: data.login,
          avatar: data.avatar,
        });
      }
      setPlayers(new_players);
    });

    console.log(players);
  };

  useEffect(() => {
    if (!socketService.socket) return;
    if (!user) {
      navigation("/");
      return;
    }

    updatePlayers();

    gameService.onGameStarted(socketService.socket, () => {
      console.log("Game started");
      updatePlayers();
    });
  }, [players]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {players.map((value) => {
            return <h4>{value.login}</h4>;
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

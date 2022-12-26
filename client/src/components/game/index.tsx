import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactPlayer from "react-player";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import Popup from "reactjs-popup";
import authContext from "../../authContext";
import { auth, db } from "../../firebase";
import gameContext from "../../gameContext";
import LobbyContext from "../../lobbyContext";
import lobbyContext, { ILobbyContextProps } from "../../lobbyContext";
import gameService, { IUser } from "../../services/gameService";
import socketService from "../../services/socketService";
import { GameInterface } from "../gameInterface";
import { PregameButtons } from "../pregameButtons";

export function Game() {
  const navigation = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const [hostId, setHostId] = useState("");
  const [isSelecting, setSelecting] = useState(false);
  const [isReady, setReady] = useState(false);
  const { roomId, isInGame, setInGame } = useContext(gameContext);
  const [players, setPlayers] = useState<IUser[]>();
  const [isSongPlaying, setSongPlaying] = useState(false);

  const lobbyContextValues: ILobbyContextProps = {
    players,
    setPlayers,
    hostId,
    setHostId,
    isSelecting,
    setSelecting,
    isReady,
    setReady,
  };

  const updatePlayers = async () => {
    if (!socketService.socket || !roomId) return;
    const res = await gameService
      .getRoomClients(socketService.socket, roomId)
      .catch((err) => alert(err));

    if (res) {
      setPlayers(res);
    }
    if (hostId === "") {
      if (!user) return;
      setHostId(user.uid);
    }
  };

  const syncPlayers = () => {
    if (!socketService.socket) return;
    updatePlayers();

    gameService.onNewPlayer(socketService.socket, () => {
      console.log("new player");
      updatePlayers();
    });

    gameService.onGameStarted(socketService.socket, () => {
      setInGame(true);
      updatePlayers();
      setSelecting(true);
    });

    gameService.onPlayerLeave(socketService.socket, () => {
      console.log("player left");
      updatePlayers();
    });

    gameService.onPlayerReady(socketService.socket, () => {
      updatePlayers();
    });
  };

  useEffect(() => {
    if (!user) {
      navigation("/");
      return;
    }

    syncPlayers();
  }, []);

  return (
    <LobbyContext.Provider value={lobbyContextValues}>
      <div className="App">
        <header className="App-header">
          <div>
            {players?.map((value) => {
              return (
                <h4 key={value.uid}>
                  player {players.indexOf(value) + 1}: {value.name}{" "}
                  {isInGame ? (value.ready ? "(ready)" : "(preparing)") : ""}
                </h4>
              );
            })}
          </div>
          <button onClick={() => setSongPlaying(!isSongPlaying)}> Play </button>
          <PregameButtons />
        </header>
        <ReactPlayer
          url="https://soundcloud.com/tol1kebol1k/kiddo-laser-minion-rush"
          height={0}
          width={0}
          playing={isSongPlaying}
        />
        <Popup
          open={isSelecting}
          onClose={() => {
            console.log("PopupClosed");
          }}
          position="top center"
          closeOnEscape={false}
          closeOnDocumentClick={false}
          modal
        >
          <GameInterface />
        </Popup>
      </div>
    </LobbyContext.Provider>
  );
}

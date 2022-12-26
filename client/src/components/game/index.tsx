import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactPlayer from "react-player";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import Popup from "reactjs-popup";
import { auth, db } from "../../firebase";
import gameContext from "../../gameContext";
import LobbyContext from "../../lobbyContext";
import lobbyContext, { ILobbyContextProps } from "../../lobbyContext";
import gameService, { ISong, IUser } from "../../services/gameService";
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
  const [song, setSong] = useState({
    url: "https://www.youtube.com/watch?v=-_3dc6X-Iwo",
    answer: "",
    holderID: "",
    holderName: "",
  });

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
      console.log("player ready");
      updatePlayers();
    });

    socketService.socket.on("next_round", (message) => {
      setSong({
        url: message.data.url,
        answer: message.data.answer,
        holderID: message.data.holderID,
        holderName: message.data.holderName,
      });
      setSongPlaying(true);
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
                  {user?.uid === value.uid
                    ? "you"
                    : `player ${players.indexOf(value) + 1}`}
                  : {value.name}
                  {isInGame ? (value.ready ? "(ready)" : "(preparing)") : ""}
                </h4>
              );
            })}
          </div>
          {isSongPlaying ? (
            <div>
              <h1>Now playing...</h1>
              <p>Name: {song.answer}</p>
              <p>By: {song.holderName}</p>
            </div>
          ) : (
            <></>
          )}

          <button
            onClick={() => {
              setSongPlaying(!isSongPlaying);
              console.log("play");
              console.log(song);
            }}
          >
            Play
          </button>
          <PregameButtons />
        </header>
        <ReactPlayer
          url={song.url}
          height={0}
          width={0}
          playing={isSongPlaying}
          pip={false}
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

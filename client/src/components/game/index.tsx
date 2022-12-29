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
import { AnswerButtons } from "../gameUI/answerButtons";
import { PregameButtons } from "../gameUI/pregameButtons";

export function Game() {
  const navigation = useNavigate();

  const [user, loading, error] = useAuthState(auth);
  const [hostId, setHostId] = useState("");
  const [isWaiting, setWaiting] = useState(false);
  const [isSelecting, setSelecting] = useState(false);
  const [isReady, setReady] = useState(false);
  const [isAnswering, setAnswering] = useState(false);
  const [isChecking, setChecking] = useState(false);
  const [canAnswer, setCanAnswer] = useState(true);
  const [numAnswers, setNumAnswers] = useState(0);
  const { roomId, isInGame, setInGame } = useContext(gameContext);
  const [players, setPlayers] = useState<IUser[]>();
  const [isListening, setListening] = useState(false);
  const [curAnswer, setCurAnswer] = useState("");
  const [someoneAnswering, setSomeoneAnswering] = useState(false);
  const [song, setSong] = useState({
    url: "https://www.youtube.com/watch?v=-_3dc6X-Iwo",
    answer: "",
    holderID: "",
    holderName: "",
  });
  const [answeringName, setAnsweringName] = useState("");
  const [curRound, setCurRound] = useState(1);

  const lobbyContextValues: ILobbyContextProps = {
    players,
    setPlayers,
    hostId,
    setHostId,
    isWaiting,
    setWaiting,
    isSelecting,
    setSelecting,
    isReady,
    setReady,
    isListening,
    setListening,
    isAnswering,
    setAnswering,
    isChecking,
    setChecking,
    canAnswer,
    setCanAnswer,
    numAnswers,
    setNumAnswers,
    someoneAnswering,
    setSomeoneAnswering,
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
    if (!socketService.socket || !user) return;
    updatePlayers();

    gameService.onNewPlayer(socketService.socket, () => {
      console.log("new player");
      updatePlayers();
    });

    gameService.onGameStarted(socketService.socket, () => {
      setInGame(true);
      updatePlayers();
      setSelecting(true);
      setWaiting(true);
    });

    gameService.onPlayerLeave(socketService.socket, () => {
      console.log("player left");
      updatePlayers();
    });

    gameService.onPlayerReady(socketService.socket, () => {
      console.log("player ready");
      updatePlayers();
      console.log(players);
    });

    socketService.socket.on("next_round", (message) => {
      setCanAnswer(true);
      setChecking(false);
      setAnswering(false);
      setWaiting(false);

      setSong({
        url: message.song.url,
        answer: message.song.answer,
        holderID: message.song.holderID,
        holderName: message.song.holderName,
      });

      console.log(song);

      setCurRound(message.round);

      if (message.song.holderID === user.uid) {
        setCanAnswer(false);
      }
      setListening(true);
    });

    socketService.socket.on("player_answer", (message) => {
      setListening(false);
      setAnsweringName(message.name);
      if (message.uid === user.uid) {
        setAnswering(true);
      }
    });

    socketService.socket.on(
      "player_submit_answer",
      (message: { uid: string; name: string; answer: string; song: ISong }) => {
        console.log(message.name, "answering", message.answer);
        if (message.song.holderID === user.uid) {
          setChecking(true);
        }
        setSomeoneAnswering(true);
        setCurAnswer(message.answer);
      }
    );

    socketService.socket.on("answer_correct", () => {
      updatePlayers();
      alert(
        `${answeringName} answered correct\nThe answer was "${song.answer}"`
      );
    });

    socketService.socket.on("game_end", () => {
      alert("Game Over");
      setInGame(false);
      navigation("/home/");
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
          {isInGame ? (
            <div>
              <h1>Round {curRound}</h1>
            </div>
          ) : (
            <></>
          )}

          {isListening ? (
            <div>
              <h2>Now playing ...?</h2>
              <p>By: {song.holderName}</p>
            </div>
          ) : (
            <></>
          )}
          <div>
            {players?.map((value) => {
              return (
                <h4 key={value.uid}>
                  {user?.uid === value.uid
                    ? "you"
                    : `player ${players.indexOf(value) + 1}`}
                  : {value.name}
                  {isWaiting ? (value.ready ? "(ready)" : "(preparing)") : ""}
                  {!isWaiting && isInGame ? `(points: ${value.points})` : ""}
                </h4>
              );
            })}
          </div>

          {someoneAnswering ? `${answeringName} answered: ${curAnswer}` : ""}
          <PregameButtons />
        </header>
        <ReactPlayer
          url={song.url}
          height={0}
          width={0}
          playing={isListening}
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

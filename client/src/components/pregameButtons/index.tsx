import React, { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import gameContext from "../../gameContext";
import lobbyContext from "../../lobbyContext";
import socketService from "../../services/socketService";

export function PregameButtons() {
  const { roomId, isInGame, setInGame } = useContext(gameContext);
  const [user] = useAuthState(auth);
  const { players, hostId } = useContext(lobbyContext);
  const navigation = useNavigate();

  const startGame = () => {
    socketService?.socket?.emit("start_game");
  };

  const isHost = (): boolean => {
    if (!user || !roomId) return false;
    return roomId.includes(user.uid);
  };

  return (
    <>
      <button
        className="App-button"
        onClick={() => console.log("kek")}
        hidden={!isInGame}
      >
        Answer!
      </button>
      <button
        className="App-button"
        hidden={isInGame}
        onClick={() => navigator.clipboard.writeText(roomId ? roomId : "")}
      >
        Copy room token
      </button>
      <button
        className="App-button"
        onClick={startGame}
        hidden={!(isHost() && !isInGame && players && players.length > 1)}
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

import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import gameContext from "../../../gameContext";
import lobbyContext from "../../../lobbyContext";
import socketService from "../../../services/socketService";
import { AnswerButtons } from "../answerButtons";
import { CheckingButtons } from "../checkingButtons";
import { LobbyButtons } from "../lobbyButtons";

export function PregameButtons() {
  const { roomId, isInGame, setInGame } = useContext(gameContext);
  const [user] = useAuthState(auth);
  const {
    players,
    hostId,
    isListening,
    isWaiting,
    setWaiting,
    setListening,
    isChecking,
    setChecking,
    isAnswering,
    setAnswering,
    canAnswer,
    setCanAnswer,
  } = useContext(lobbyContext);

  const isHost = (): boolean => {
    if (!user || !roomId) return false;
    return roomId.includes(user.uid);
  };

  const onAnswer = () => {
    if (!socketService.socket || !user) return;

    setListening(false);
    socketService.socket.emit("player_answer", { uid: user.uid });
    setCanAnswer(true);
    console.log("isListening", isListening);
  };

  useEffect(() => {
    if (!user || !socketService.socket) return;
  }, []);

  return (
    <>
      {isAnswering ? <AnswerButtons /> : <></>}
      {!isInGame ? <LobbyButtons /> : <></>}
      {isChecking ? <CheckingButtons /> : <></>}
      {isListening ? (
        <button disabled={!canAnswer} onClick={onAnswer}>
          Answer
        </button>
      ) : (
        <></>
      )}
    </>
  );
}

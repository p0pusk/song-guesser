import React, { useContext } from "react";
import lobbyContext from "../../../lobbyContext";
import socketService from "../../../services/socketService";

export function CheckingButtons() {
  const {
    isChecking,
    setChecking,
    setListening,
    numAnswers,
    setNumAnswers,
    players,
    setSomeoneAnswering,
  } = useContext(lobbyContext);

  const onCorrect = () => {
    if (!socketService.socket) return;
    socketService.socket.emit("answer_correct");
    setChecking(false);
    setSomeoneAnswering(false);
    socketService.socket.emit("round_end");
  };
  const onWrong = () => {
    if (!players || !socketService.socket) return;

    if (numAnswers >= players.length - 2) {
      socketService.socket.emit("round_end");
      setNumAnswers(0);
    }

    setNumAnswers(numAnswers + 1);

    setSomeoneAnswering(false);
    setChecking(false);
    setListening(true);
  };

  return (
    <div>
      <button onClick={onCorrect}>Correct</button>
      <button onClick={onWrong}>Wrong</button>
    </div>
  );
}

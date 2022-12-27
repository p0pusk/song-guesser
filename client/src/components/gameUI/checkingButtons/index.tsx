import React, { useContext } from "react";
import lobbyContext from "../../../lobbyContext";
import socketService from "../../../services/socketService";

export function CheckingButtons() {
  const { isChecking, setChecking, setListening } = useContext(lobbyContext);

  const onCorrect = () => {
    if (!socketService.socket) return;
    socketService.socket.emit("answer_correct");
    setChecking(false);
  };
  const onWrong = () => {
    if (!socketService.socket) return;
    socketService.socket.emit("answer_wrong");
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

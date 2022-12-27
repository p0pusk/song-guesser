import { useContext, useState } from "react";
import lobbyContext from "../../../lobbyContext";
import socketService from "../../../services/socketService";

export function AnswerButtons() {
  const [answer, setAnswer] = useState("");
  const { isAnswering, setAnswering } = useContext(lobbyContext);

  const handleAnswer = (e: React.ChangeEvent<any>) => {
    e.preventDefault();
    setAnswer(e.target.value);
  };

  const onSubmit = () => {
    if (!socketService.socket) return;

    socketService.socket.emit("submit_answer", { answer: answer });
    setAnswering(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={answer}
        onChange={handleAnswer}
        placeholder={"Your answer"}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

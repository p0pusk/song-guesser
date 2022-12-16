import { useState } from "react";
import { JoinRoom } from "../joinRoom";
import GameContext, { IGameContextProps } from "../../gameContext";
import { Link, useNavigate } from "react-router-dom";

export function Home() {
  const [isInRoom, setInRoom] = useState(false);
  const navigator = useNavigate();

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <div className="App">
        <header className="App-header">
          <JoinRoom />
          <button onClick={() => navigator("/collections")}>Collections</button>
        </header>
      </div>
    </GameContext.Provider>
  );
}

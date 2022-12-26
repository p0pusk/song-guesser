import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  roomId: string | null;
  setRoomId: (id: string) => void;
  isInGame: boolean;
  setInGame: (inGame: boolean) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setInRoom: () => {},
  roomId: null,
  setRoomId: () => {},
  isInGame: false,
  setInGame: () => {},
};

export default React.createContext(defaultState);

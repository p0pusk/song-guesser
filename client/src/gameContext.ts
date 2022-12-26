import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  roomId: string | null;
  setRoomId: (id: string) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setInRoom: () => {},
  roomId: null,
  setRoomId: () => {},
};

export default React.createContext(defaultState);

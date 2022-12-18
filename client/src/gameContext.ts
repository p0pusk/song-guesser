import React from "react";

export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (inRoom: boolean) => void;
  roomId: string | null;
  setRoomId: (id: string) => void;
  players: { id: string; login: string; avatar: File | null }[];
  setPlayers: (
    players: {
      id: string;
      login: string;
      avatar: File | null;
    }[]
  ) => void;
}

const defaultState: IGameContextProps = {
  isInRoom: false,
  setInRoom: () => {},
  roomId: null,
  setRoomId: () => {},
  players: new Array<{ id: string; login: string; avatar: File | null }>(),
  setPlayers: () => {},
};

export default React.createContext(defaultState);

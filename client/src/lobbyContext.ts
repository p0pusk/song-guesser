import React from "react";
import { IUser } from "./services/gameService";

export interface ILobbyContextProps {
  players: IUser[] | undefined;
  setPlayers: (new_players: IUser[] | undefined) => void;
  hostId: string;
  setHostId: (host: string) => void;
  isSelecting: boolean;
  setSelecting: (selecting: boolean) => void;
  isReady: boolean;
  setReady: (ready: boolean) => void;
}

const defaultState: ILobbyContextProps = {
  players: new Array<IUser>(),
  setPlayers: () => {},
  hostId: "",
  setHostId: () => {},
  isSelecting: false,
  setSelecting: () => {},
  isReady: false,
  setReady: () => {},
};

export default React.createContext(defaultState);

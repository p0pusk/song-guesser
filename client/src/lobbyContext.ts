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
  isListening: boolean;
  setListening: (listening: boolean) => void;
  isAnswering: boolean;
  setAnswering: (answering: boolean) => void;
  isChecking: boolean;
  setChecking: (checking: boolean) => void;
  canAnswer: boolean;
  setCanAnswer: (can: boolean) => void;
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
  isListening: false,
  setListening: () => {},
  isAnswering: false,
  setAnswering: () => {},
  isChecking: false,
  setChecking: () => {},
  canAnswer: true,
  setCanAnswer: () => {},
};

export default React.createContext(defaultState);

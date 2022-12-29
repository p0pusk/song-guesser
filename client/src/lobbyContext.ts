import React from "react";
import { IUser } from "./services/gameService";

export interface ILobbyContextProps {
  players: IUser[] | undefined;
  setPlayers: (new_players: IUser[] | undefined) => void;
  hostId: string;
  setHostId: (host: string) => void;
  isWaiting: boolean;
  setWaiting: (waiting: boolean) => void;
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
  numAnswers: number;
  setNumAnswers: (num: number) => void;
  someoneAnswering: boolean;
  setSomeoneAnswering: (is: boolean) => void;
}

const defaultState: ILobbyContextProps = {
  players: new Array<IUser>(),
  setPlayers: () => {},
  hostId: "",
  setHostId: () => {},
  isWaiting: false,
  setWaiting: () => {},
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
  numAnswers: 0,
  setNumAnswers: () => {},
  someoneAnswering: false,
  setSomeoneAnswering: () => {},
};

export default React.createContext(defaultState);

import React from "react";

export interface IAuthContextProps {
  isAuth: boolean;
  setAuth: (auth: boolean) => void;
  login: string | null;
  setLogin: (val: string) => void;
  avatar: File | null;
  setAvatar: (image: File | null) => void;
}

const defaultState: IAuthContextProps = {
  isAuth: false,
  setAuth: () => {},
  login: null,
  setLogin: () => {},
  avatar: null,
  setAvatar: () => {},
};

export default React.createContext(defaultState);

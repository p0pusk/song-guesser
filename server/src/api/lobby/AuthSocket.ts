import { Socket } from "socket.io";
import { Room } from "./Room";
import { IUser } from "./UserTypes";

export type AuthSocket = Socket & {
  data: IUser & {
    lobby: null | Room;
  };
};

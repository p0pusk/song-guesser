import { Socket } from "socket.io";
import { Room } from "./Room";

export type AuthSocket = Socket & {
  data: {
    uid: string;
    name: string;
    email: string;
    avatar: File | null;
    lobby: null | Room;
    ready: boolean;
  };
};

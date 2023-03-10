import { Socket } from "socket.io-client";

export type IUser = {
  uid: string;
  name: string;
  email: string;
  avatar: File | null;
  ready: boolean;
  points: number;
  answered: boolean;
};

export type ISong = {
  url: string;
  answer: string;
  holderID: string;
  holderName: string;
};

class GameService {
  public started = false;

  public async joinGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((res, rej) => {
      socket.emit("join_room", {
        roomId,
      });
      socket.on("join_room_success", () => res(true));
      socket.on("join_room_error", ({ error }) => rej(error));
    });
  }

  public async createGameRoom(
    socket: Socket,
    params: { roomId: string; userId: string }
  ): Promise<boolean> {
    return new Promise((res, rej) => {
      socket.emit("create_room", {
        roomId: params.roomId,
        userId: params.userId,
      });
      socket.on("create_room_success", () => res(true));
      socket.on("create_room_error", ({ error }) => rej(error));
    });
  }

  public async checkGameRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((res, rej) => {
      socket.emit("check_room", { roomId });
      socket.on("room_exists", () => res(true));
      socket.on("room_not_exists", () => res(false));
    });
  }

  public startGame(socket: Socket) {
    socket.emit("start_game");
    this.started = true;
  }

  public async getRoomClients(
    socket: Socket,
    roomId: string
  ): Promise<IUser[]> {
    return new Promise((res, rej) => {
      socket.emit("get_clients", { roomId: roomId });
      socket.on("get_clients_success", (message) => {
        res(message.data);
      });
      socket.on("get_clients_error", ({ error }) => rej(error));
    });
  }

  public submitSong(socket: Socket, song: ISong) {
    socket.emit("submit_song", song);
  }

  public onNewPlayer(socket: Socket, listener: () => void) {
    socket.on("new_player", listener);
  }

  public onPlayerLeave(socket: Socket, listener: () => void) {
    socket.on("player_leave", listener);
  }

  public onGameStarted(socket: Socket, listener: () => void) {
    socket.on("game_started", listener);
  }

  public onPlayerReady(socket: Socket, listener: () => void) {
    socket.on("player_ready", listener);
  }
}

export default new GameService();

import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket | null = null;

  public connect(url: string): Promise<Socket> {
    return new Promise((res, rej) => {
      this.socket = io(url);

      if (!this.socket) return rej();

      this.socket.on("connect", () => {
        res(this.socket as Socket);
      });

      this.socket.on("connect_error", (err) => {
        console.log("connect_error", err);
        rej(err);
      });
    });
  }
}

export default new SocketService();

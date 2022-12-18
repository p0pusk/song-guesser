import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket | null = null;

  public connect(url: string, uid: string): Promise<Socket> {
    return new Promise((res, rej) => {
      this.socket = io(url);

      if (!this.socket) return rej();

      this.socket.on("connect", () => {
        if (!this.socket) return rej();

        this.socket.emit("auth_socket", { uid });
        this.socket.on("auth_socket_success", () => {
          res(this.socket as Socket);
        });

        this.socket.on("auth_socket_error", (e) => {
          console.log("auth_socket_error");
          rej(e);
        });
      });

      this.socket.on("connect_error", (err) => {
        console.log("connect_error", err);
        rej(err);
      });
    });
  }

  public disconnect() {
    this.socket?.disconnect();
  }
}

export default new SocketService();

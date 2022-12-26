import { Server, Socket } from "socket.io";
import { AuthSocket } from "./AuthSocket";
import { Instance } from "./Instance";

export class Room {
  public readonly clients: Map<Socket["id"], AuthSocket> = new Map();
  public readonly instance: Instance = new Instance(this);

  constructor(
    public readonly id: string,
    private readonly server: Server,
    public readonly maxClients: number
  ) {}

  public addClient(client: AuthSocket): void {
    this.clients.set(client.id, client);
    client.join(this.id);
    client.data.lobby = this;
  }

  public emit(message: any, args: any = undefined) {
    if (args) {
      this.server.to(this.id).emit(message, args);
    } else {
      this.server.to(this.id).emit(message);
    }
  }

  public removeClient(client: AuthSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;
    client.data.ready = false;
  }
}

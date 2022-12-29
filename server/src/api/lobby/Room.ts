import { Server, Socket } from "socket.io";
import { AuthSocket } from "./AuthSocket";
import { Instance } from "./Instance";
import { ISong } from "./UserTypes";

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
    client.data.points = 0;
    client.data.answered = false;
    client.data.ready = false;
  }

  public emit(message: any, args: any = undefined) {
    if (args) {
      this.server.to(this.id).emit(message, args);
    } else {
      this.server.to(this.id).emit(message);
    }
  }

  public addSong(song: ISong) {
    this.instance.songs.push(song);
  }

  public getNextSong() {
    const max = this.instance.songsPool.length;
    const random = Math.floor(Math.random() * max);
    const res = this.instance.songsPool.at(random);
    this.instance.songsPool.splice(random, 1);
    this.instance.curentSong = res;

    return res;
  }

  public removeClient(client: AuthSocket): void {
    this.clients.delete(client.id);
    client.leave(this.id);
    client.data.lobby = null;
    client.data.ready = false;
  }
}

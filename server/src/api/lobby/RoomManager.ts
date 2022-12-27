import { Server } from "socket.io";
import { AuthSocket } from "./AuthSocket";
import { IUser } from "./UserTypes";
import { Room } from "./Room";

class RoomManager {
  public server: Server;

  public rooms: Map<Room["id"], Room>;
  public maxClients = 2;

  constructor() {
    this.rooms = new Map();
  }

  public initializeSocket(client: AuthSocket) {
    client.data.lobby = null;
    client.data.email = null;
    client.data.uid = null;
    client.data.avatar = null;
    client.data.ready = false;
  }

  public terminateSocket(client: AuthSocket) {
    client.data.lobby.removeClient(client);
  }

  public createRoom(id: string): Room {
    const lobby = new Room(id, this.server, this.maxClients);
    this.rooms.set(lobby.id, lobby);
    return lobby;
  }

  public joinRoom(id: string, client: AuthSocket) {
    const room = this.rooms.get(id);
    if (!room) {
      throw "Lobby not found";
    }
    if (room.clients.size === room.maxClients) {
      throw "Lobby full";
    }
    room.addClient(client);
  }

  public getClientsData(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw "[Get clients data]: Lobby not found";
    }

    let data = new Array<IUser>();
    room.clients.forEach((client) => {
      data.push({
        uid: client.data.uid,
        name: client.data.name,
        email: client.data.email,
        avatar: client.data.avatar,
        ready: client.data.ready,
      });
    });
    return data;
  }
}

export default new RoomManager();

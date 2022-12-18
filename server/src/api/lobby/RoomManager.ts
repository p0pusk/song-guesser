import { Server } from "socket.io";
import { AuthSocket } from "./AuthSocket";
import { UserData } from "./userData";
import { Room } from "./Room";

class RoomManager {
  public server: Server;

  public rooms: Map<Room["id"], Room>;

  constructor() {
    this.rooms = new Map();
  }

  public initializeSocket(client: AuthSocket) {
    client.data.lobby = null;
    client.data.email = null;
    client.data.uid = null;
    client.data.avatar = null;
  }

  public terminateSocket(client: AuthSocket) {
    client.data.lobby.removeClient(client);
  }

  public createRoom(id: string): Room {
    let maxClients = 2;
    const lobby = new Room(id, this.server, maxClients);
    this.rooms.set(lobby.id, lobby);
    return lobby;
  }

  public joinRoom(id: string, client: AuthSocket) {
    const room = this.rooms.get(id);
    if (!room) {
      throw new Error("Lobby not found");
    }
    if (room.clients.size === room.maxClients) {
      throw new Error("Lobby full");
    }
    room.addClient(client);
  }

  public getClientsData(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Lobby not found");
    }

    let data = new Array<UserData>();
    room.clients.forEach((client) => {
      data.push({
        name: client.data.name,
        email: client.data.email,
        avatar: client.data.avatar,
      });
    });
    return data;
  }
}

export default new RoomManager();

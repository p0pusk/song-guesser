import {
  ConnectedSocket,
  EmitOnSuccess,
  MessageBody,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import socket from "../../socket";
import { AuthSocket } from "../lobby/AuthSocket";
import RoomManager from "../lobby/RoomManager";

@SocketController()
export class RoomController {
  public readonly roomManager = RoomManager;

  constructor(@SocketIO() io: Server) {
    this.roomManager.server = io;
  }

  @OnMessage("create_room")
  @EmitOnSuccess("create_room_success")
  public async createRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() message: any
  ) {
    try {
      this.roomManager.createRoom(message.roomId);
      this.roomManager.joinRoom(message.roomId, socket);
    } catch (e) {
      console.log(e);
      socket.emit("create_room_error", { error: e });
    }
  }

  @OnMessage("join_room")
  @EmitOnSuccess("join_room_success")
  public async joinGame(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() message: any
  ) {
    try {
      this.roomManager.joinRoom(message.roomId, socket);
      this.roomManager.rooms.get(message.roomId).emit("new_player");
      console.log(`${socket.data.name} joined ${message.roomId}`);
    } catch (e) {
      console.log(e);
      socket.emit("join_room_error", { error: e });
    }
  }

  @OnMessage("leave_room")
  public async leaveRoom(@ConnectedSocket() socket: AuthSocket) {
    console.log(`[room ${socket.data.lobby.id}]: exiting ${socket.data.name}`);
    this.roomManager.terminateSocket(socket);
  }

  @OnMessage("check_room")
  public async checkRoom(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    if (io.sockets.adapter.rooms.has(message.roomId)) {
      socket.emit("room_exists");
    } else {
      socket.emit("room_not_exists");
    }
  }

  @OnMessage("get_clients")
  @EmitOnSuccess("get_clients_success")
  public async getClients(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() message: any
  ) {
    try {
      const data = this.roomManager.getClientsData(message.roomId);
    } catch (e) {
      socket.emit("get_clients_error", { error: e });
    }
  }

  @OnMessage("start_game")
  public startGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket) {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (socketRooms.length === 1) {
      io.to(socketRooms[0]).emit("game_started");
    } else {
      socket.emit("start_game_error");
    }
  }

  @OnDisconnect()
  public onDisconnect(@ConnectedSocket() socket: AuthSocket) {
    this.roomManager.terminateSocket(socket);
  }
}

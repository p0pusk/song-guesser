import { Auth } from "firebase/auth";
import {
  ConnectedSocket,
  EmitOnSuccess,
  MessageBody,
  OnConnect,
  OnDisconnect,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";
import socket from "../../socket";
import { AuthSocket } from "../lobby/AuthSocket";
import RoomManager from "../lobby/RoomManager";
import { ISong } from "../lobby/UserTypes";

@SocketController()
export class RoomController {
  public readonly roomManager = RoomManager;

  constructor(@SocketIO() io: Server) {
    this.roomManager.server = io;
  }

  @OnConnect()
  public async initServer(@SocketIO() io: Server) {
    if (!this.roomManager.server) {
      this.roomManager.server = io;
    }
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
    console.log(socket.data.name, "created room:", message.roomId);
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
      socket.emit("new_player", {
        data: {
          uid: socket.data.uid,
          name: socket.data.name,
          avatar: socket.data.avatar,
          email: socket.data.email,
        },
      });
      console.log(`${socket.data.name} joined ${message.roomId}`);
    } catch (e) {
      console.log(e);
      socket.emit("join_room_error", { error: e });
    }
    this.roomManager.rooms.get(message.roomId).clients.forEach((client) => {
      console.log("in room: ", client.data.name);
    });
  }

  @OnMessage("leave_room")
  public async leaveRoom(@ConnectedSocket() socket: AuthSocket) {
    console.log(`[room ${socket.data.lobby.id}]: exiting ${socket.data.name}`);
    socket.data.lobby.emit("player_leave");
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
  public async getClients(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() message: any
  ) {
    try {
      const data = this.roomManager.getClientsData(message.roomId);
      socket.emit("get_clients_success", { data: data });
      console.log(data);
    } catch (e) {
      socket.emit("get_clients_error", { error: e });
    }
  }

  @OnMessage("start_game")
  public startGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: AuthSocket
  ) {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );

    if (socketRooms.length === 1) {
      socket.data.lobby.instance.hasStarted = true;
      socket.data.lobby.emit("game_started");
    } else {
      socket.emit("start_game_error", { error: "Socket in another room" });
    }
  }

  @OnMessage("ready")
  public playerReady(@ConnectedSocket() socket: AuthSocket) {
    socket.data.ready = true;
    socket.data.lobby.emit("player_ready", { uid: socket.data.uid });

    let allReady = true;
    socket.data.lobby.clients.forEach((client) => {
      if (!client.data.ready) {
        allReady = false;
      }
    });

    console.log("all ready:", allReady);
    if (allReady) {
      socket.data.lobby.instance.songsPool = [
        ...socket.data.lobby.instance.songs,
      ];

      console.log(socket.data.lobby.instance.songsPool);
      const song = socket.data.lobby.getNextSong();
      console.log(song);
      socket.data.lobby.emit("next_round", {
        song: song,
        round: socket.data.lobby.instance.currentRound,
      });
    }
  }

  @OnMessage("player_answer")
  public playerAnswer(@ConnectedSocket() socket: AuthSocket) {
    socket.data.lobby.emit("player_answer", {
      uid: socket.data.uid,
      name: socket.data.name,
    });
  }

  @OnMessage("answer_correct")
  public answer_correct(@ConnectedSocket() socket: AuthSocket) {
    socket.data.points++;
    socket.data.lobby.emit("answer_correct");
  }

  @OnMessage("round_end")
  public roundEnd(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() message: any
  ) {
    console.log(socket.data.lobby.instance.songsPool);
    if (socket.data.lobby.instance.songsPool.length > 0) {
      const song = socket.data.lobby.getNextSong();
      socket.data.lobby.instance.currentRound++;
      socket.data.lobby.emit("next_round", {
        song: song,
        round: socket.data.lobby.instance.currentRound,
      });
    } else {
      socket.data.lobby.emit("game_end");
    }
  }

  @OnMessage("submit_song")
  public submitSong(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() song: ISong
  ) {
    try {
      socket.data.lobby.addSong(song);
    } catch (e) {
      console.log(e);
    }
  }

  @OnMessage("submit_answer")
  public submitAnswer(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() message: { answer: string }
  ) {
    socket.data.lobby.emit("player_submit_answer", {
      uid: socket.data.uid,
      name: socket.data.name,
      answer: message.answer,
      song: socket.data.lobby.instance.curentSong,
    });
  }

  @OnDisconnect()
  public onDisconnect(@ConnectedSocket() socket: AuthSocket) {
    this.roomManager.terminateSocket(socket);
  }
}

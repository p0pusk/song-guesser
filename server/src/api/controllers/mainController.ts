import {
  ConnectedSocket,
  OnConnect,
  OnDisconnect,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Socket, Server } from "socket.io";

@SocketController()
export class MainController {
  @OnConnect()
  public onConnection(
    @ConnectedSocket() socket: Socket,
    @SocketIO() io: Server
  ) {
    console.log("New connection", socket.id);

    socket.on("custom-event", (data: any) => {
      console.log("Data: ", data);
    });
  }

  @OnDisconnect()
  public onDisconnect(@ConnectedSocket() socket: Socket) {
    console.log("Disconnected", socket.id);
  }
}

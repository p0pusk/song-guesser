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
import { Socket, Server } from "socket.io";
import { AuthSocket } from "../lobby/AuthSocket";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { IUser } from "../lobby/UserTypes";

@SocketController()
export class MainController {
  fetchUserData = async (id: string): Promise<IUser> => {
    return new Promise(async (res, rej) => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", id));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        res({
          uid: id,
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          ready: false,
          answered: false,
          points: 0,
        });
      } catch (err) {
        rej(err);
      }
    });
  };

  public initSocket(socket: AuthSocket) {
    socket.data.uid = null;
    socket.data.avatar = null;
    socket.data.email = null;
    socket.data.name = null;
  }

  @OnConnect()
  public onConnection(@ConnectedSocket() socket: Socket) {
    this.initSocket(socket as AuthSocket);
  }

  @OnMessage("auth_socket")
  @EmitOnSuccess("auth_socket_success")
  public async authSocket(
    @ConnectedSocket() socket: AuthSocket,
    @MessageBody() message: any
  ) {
    const data = await this.fetchUserData(message.uid).catch((e) => {
      socket.emit("auth_socket_error", { error: e });
      return;
    });

    if (!data) {
      socket.emit("auth_socket_error", { error: "Error fetching data" });
      return;
    }

    socket.data.uid = message.uid;
    socket.data.name = data?.name;
    socket.data.avatar = data?.avatar;
    socket.data.email = data?.email;

    console.log("New connection:", socket.data.name);
  }

  @OnDisconnect()
  public onDisconnect(@ConnectedSocket() socket: Socket) {
    console.log("Disconnected", socket.data.name);
  }
}

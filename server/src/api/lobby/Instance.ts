import { Room } from "./Room";
import { ISong } from "./UserTypes";

export class Instance {
  public hasStarted: boolean = false;

  public hasFinished: boolean = false;

  public isSuspended: boolean = false;

  public currentRound: number = 1;

  public songs: ISong[] = new Array<ISong>();

  public songsPool: ISong[] = new Array<ISong>();

  public curentSong: ISong = null;

  constructor(private readonly lobby: Room) {}
}

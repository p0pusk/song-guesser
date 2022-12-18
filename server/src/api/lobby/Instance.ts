import { Room } from "./Room";

export class Instance {
  public hasStarted: boolean = false;

  public hasFinished: boolean = false;

  public isSuspended: boolean = false;

  public currentRound: number = 1;

  constructor(private readonly lobby: Room) {}
}

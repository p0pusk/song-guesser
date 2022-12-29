export type IUser = {
  uid: string;
  name: string;
  email: string;
  avatar: File | null;
  ready: boolean;
  points: number;
  answered: boolean;
};

export type ISong = {
  url: string;
  answer: string;
  holderID: string;
  holderName: string;
};

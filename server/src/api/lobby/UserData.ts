export type IUser = {
  uid: string;
  name: string;
  email: string;
  avatar: File | null;
  ready: boolean;
};

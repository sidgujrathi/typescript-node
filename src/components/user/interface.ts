import { ITimestamp } from '../common/interface';

export interface IUser extends PersistedPassword, ITimestamp {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

export interface IUserResponse {
  success?: boolean;
  item?: IUser;
  items?: IUser[];
  error?: string;
}

export interface PersistedPassword {
  salt: string;
  password: string;
  iterations: number;
}

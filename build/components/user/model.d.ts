import { Model } from 'mongoose';
import { IUser, PersistedPassword } from './interface';
export declare function generateHashPassword(password: string): Promise<PersistedPassword>;
export declare function verifyPassword(savedPassword: string, savedSalt: string, savedIterations: number, passwordAttempt: string): Promise<boolean>;
declare const User: Model<IUser>;
export default User;

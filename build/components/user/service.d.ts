import { IUser } from './interface';
import { Types } from 'mongoose';
export declare class UserService {
    create(data: IUser): Promise<IUser>;
    findByEmail(input: any, projections: any): Promise<IUser>;
    find(): Promise<IUser[]>;
    findById(id: Types.ObjectId): Promise<IUser>;
}

import User from './model';
import { IUser } from './interface';
import { Types } from 'mongoose';

export class UserService {
  public async create(data: IUser) {
    return new User(data).save();
  }

  public async findByEmail(input: any, projections: any) {
    return User.findOne({ email: input.email }, projections);
  }

  public async find() {
    return User.find({});
  }

  public async findById(id: Types.ObjectId) {
    return User.findById(id);
  }
}

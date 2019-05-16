import { Document } from 'mongoose';
export interface ITimestamp extends Document {
    createdAt: Date;
    updatedAt: Date;
}

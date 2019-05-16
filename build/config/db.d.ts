import * as mongoose from 'mongoose';
export declare class MongoDB {
    constructor();
    connection(): Promise<mongoose.Mongoose>;
}

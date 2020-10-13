import { Document, Schema } from 'mongoose';


export default interface IUser extends Document {
    username: string;
    createdAt: Date;
    deviceId: string;
    submissions: Array<Schema.Types.ObjectId>;
}

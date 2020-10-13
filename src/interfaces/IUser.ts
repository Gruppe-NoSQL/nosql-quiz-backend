import { Document } from 'mongoose';

export default interface IUser extends Document {
    username: string;
    createdAt: Date;
    deviceId: string;
    score: number;
}
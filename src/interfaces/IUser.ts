import { Document, Schema } from 'mongoose';
import IQuestionSubSchema from './IQuestionSubSchema';


export default interface IUser extends Document {
    username: string;
    createdAt: Date;
    deviceId: string;
    submissions: Array<IQuestionSubSchema>;
    score: number;
}

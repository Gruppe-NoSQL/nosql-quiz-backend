import { Mongoose } from "mongoose";
import { Document, Schema} from 'mongoose';

export default interface IQuestionSubSchema extends Document {
    question: Schema.Types.ObjectId;
    submission: String,
    answerCorrect: boolean | null;
}
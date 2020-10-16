import { Document, Schema} from 'mongoose';

export default interface IQuestionSubSchema extends Document {
    questionId: Schema.Types.ObjectId;
    submission: String,
    isAnswerCorrect: boolean | null;
}
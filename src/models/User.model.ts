import { timeStamp } from 'console';
import mongoose, { Schema } from 'mongoose';
import QuestionModel from './Question.model'
import IUser from './../interfaces/IUser';
import IQuestionSubSchema from '../interfaces/IQuestionSubSchema'

//User Question Subschema
const QuestionSubSchema : Schema <IQuestionSubSchema> = new Schema ({
  questionId: {type: Schema.Types.ObjectId, required: true},
  submission: {type: String, required: true},
  answerCorrect: {type: Boolean, required: false}
}, {
  _id: false,
});
  

//User Schema
const UserSchema: Schema = new Schema({
    username: {type: String, required: true},
    deviceId: {type: String, required: true},
    score: {type: Number, required: false},
    submissions: [
      {
        type: QuestionSubSchema
      }
    ]
    
}, 
{
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    },
    timestamps: {createdAt: 'createdAt'}
  });


export default mongoose.model<IUser>('User', UserSchema);
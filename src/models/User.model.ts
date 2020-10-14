import { timeStamp } from 'console';
import mongoose, { Schema } from 'mongoose';
import IUser from './../interfaces/IUser';
import IQuestionSubSchema from '../interfaces/IQuestionSubSchema'

//User Question Subschema
const QuestionSubSchema : Schema <IQuestionSubSchema> = new Schema ({
  //id ausschalten
  question: {type: Schema.Types.ObjectId, required: true},
  submission: {type: String, required: true}
}, {
  _id: false
});

QuestionSubSchema.virtual('answerCorrect').get(function( this: { question:String, submission: String}) {
  return this.question == this.submission ? true : false;
});
  

//User Schema
const UserSchema: Schema = new Schema({
    username: {type: String, required: true},
    deviceId: {type: String, required: true},
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
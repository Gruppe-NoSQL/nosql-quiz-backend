import { timeStamp } from 'console';
import mongoose, { Schema } from 'mongoose';
import IQuestion from './../interfaces/IQuestion';



//Question Schema
const QuestionSchema: Schema = new Schema({
    question: {type: String, required: true},
    answer1: {type: String, required: true},
    answer2: {type: String, required: true},
    answer3: {type: String, required: true},
    answer4: {type: String, required: true},
    //korrekte Antwort als a,b,c oder d
    correctAnswer: {type: String, required: true},
    
    
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
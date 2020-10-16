import { Document, Schema } from 'mongoose';


export default interface IQuestion extends Document {
    question: {type: String, required: true},
    answer1: {type: String, required: true},
    answer2: {type: String, required: true},
    answer3: {type: String, required: true},
    answer4: {type: String, required: true},
    //korrekte Antwort als a,b,c oder d
    correctAnswer: {type: String, required: true},
}
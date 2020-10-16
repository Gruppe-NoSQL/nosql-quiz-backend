import { Document, Schema } from 'mongoose';


export default interface IQuestion extends Document {
    question: String
    answer1: String
    answer2: String
    answer3: String
    answer4: String
    //korrekte Antwort als a,b,c oder d
    correctAnswer: String
}
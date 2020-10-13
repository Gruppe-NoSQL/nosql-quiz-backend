import mongoose, { Schema } from 'mongoose';
import IUser from './../interfaces/IUser';

//User Schema
const UserSchema: Schema = new Schema({
    username: {type: String, required: true},
    deviceId: {type: String, required: true},
    score: {type: Number, default: 0}
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
import { Document } from "mongoose";


export interface IUser extends Document {
    name: string,
    profileImage: string,
    email: string,
    password: string,
    resetPasswordToken: string,
    resetPasswordExpires: Date,
    confirmed: boolean,
    comparePassword(password: string): Promise<boolean>
}
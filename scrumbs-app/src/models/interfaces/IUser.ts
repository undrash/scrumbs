import { Document } from "mongoose";


export interface IUser extends Document {
    name: string,
    profileImage: string,
    email: string,
    password: string,
    resetPasswordToken: string,
    resetPasswordExpires: Date,
    confirmed: boolean,
    googleId: string,
    twitterId: string,
    onboardingGuidesDisplayed: number[],
    comparePassword(password: string): Promise<boolean>
}
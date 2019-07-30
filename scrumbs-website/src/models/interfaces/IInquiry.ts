import { Document } from "mongoose";



export interface IInquiry extends Document {
    name: string,
    email: string,
    message: string
}
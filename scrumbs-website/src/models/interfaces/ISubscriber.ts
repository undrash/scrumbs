
import { Document } from "mongoose";





export interface ISubscriber extends Document {
    id: string,
    name: string,
    email: string,
}
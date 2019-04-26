

import { Document, Schema } from "mongoose";





export interface IInquiry extends Document {
    user: Schema.Types.ObjectId,
    type: number,
    name: string,
    description: string,
    date: Date
}
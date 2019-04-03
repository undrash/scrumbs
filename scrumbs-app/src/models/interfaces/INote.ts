

import { Document, Schema } from "mongoose";





export interface INote extends Document {
    owner: Schema.Types.ObjectId,
    member: Schema.Types.ObjectId,
    team: string,
    content: string,
    isImpediment: boolean,
    isSolved: boolean,
    date: Date
}
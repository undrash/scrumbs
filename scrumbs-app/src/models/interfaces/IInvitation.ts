

import { Document, Schema } from "mongoose";





export interface IInvitation extends Document {
    from: Schema.Types.ObjectId,
    team: Schema.Types.ObjectId,
    accepted: boolean,
    date: Date
}
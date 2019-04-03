

import { Document, Schema } from "mongoose";





export interface IMember extends Document {
    owner: Schema.Types.ObjectId,
    name: string,
    teams: Schema.Types.ObjectId[],
    notes: Schema.Types.ObjectId[]
}
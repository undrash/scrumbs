

import { Document, Schema } from "mongoose";





export interface ITeam extends Document {
    name: string,
    owner: Schema.Types.ObjectId,
    moderators: Schema.Types.ObjectId[]
}
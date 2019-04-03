

import { Schema, model } from "mongoose";
import { ITeam } from "./interfaces/ITeam";





const TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    moderators: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],

    isDefault: {
        type: Boolean,
        default: false
    }

});


export default model<ITeam>( "Team", TeamSchema );




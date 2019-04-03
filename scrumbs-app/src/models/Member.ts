

import { IMember } from "./interfaces/IMember";
import { Schema, model } from "mongoose";





const MemberSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    teams: [
        {
            type: Schema.Types.ObjectId,
            ref: "Team"
        }
    ],

    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note",
            default: []
        }
    ]

});


export default model<IMember>( "Member", MemberSchema );

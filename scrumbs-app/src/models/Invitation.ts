

import { IInvitation } from "./interfaces/IInvitation";
import { Schema, model } from "mongoose";





const InvitationSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
    },

    accepted: {
        type: Boolean,
        default: false
    },

    date: {
        type: Date,
        default: Date.now
    }
});


export default model<IInvitation>( "Invitation", InvitationSchema );
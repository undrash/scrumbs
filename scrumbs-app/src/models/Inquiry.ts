
import { Schema, model } from "mongoose";
import {IInquiry} from "./interfaces/IInquiry";





const InquirySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: Number,
        required: true
    },

    name: {
        type: String,
        required: true,
        validate: {
            validator: (name: string) => name.length > 1 && name.length <= 150,
            message: "Inquiry mame has to to be at least two characters in length, but not longer than 150."
        }
    },

    description: {
        type: String,
        required: true,
        validate: {
            validator: (desc: string) => desc.length > 1 && desc.length <= 1000,
            message: "Description has to to be at least two characters in length, but not longer than 1000."
        }
    },

    date: {
        type: Date,
        default: Date.now
    }
});



export default model<IInquiry>( "Inquiry", InquirySchema );
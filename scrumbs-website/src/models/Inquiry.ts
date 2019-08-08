
import { Schema, model } from "mongoose";
import { IInquiry } from "./interfaces/IInquiry";



const InquirySchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },
}, { timestamps: true } );


export default model<IInquiry>( "Inquiry", InquirySchema );
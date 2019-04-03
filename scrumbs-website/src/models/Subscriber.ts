import { Schema, model } from "mongoose";
import {ISubscriber} from "./interfaces/ISubscriber";



const SubscriberSchema = new Schema({
    id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test( email );
            },
            message: "Please provide a valid email address."
        }
    }

});



export default model<ISubscriber>( "Subscriber", SubscriberSchema );
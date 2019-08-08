
import RequireAuthentication from "../middlewares/RequireAuthentication";
import { Router, Request, Response, NextFunction } from "express";
import {InquiryTypes} from "../models/constants/InquiryTypes";
import Inquiry from "../models/Inquiry";

import * as request from "request";
import * as moment from "moment";





class InquiryController {

    router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( '/', RequireAuthentication, this.createInquiry );
    }



    public createInquiry(req: Request, res: Response, next: NextFunction) {

        const userId                        = ( req as any ).user._id;
        const { type, name, description }   = req.body;

        const start     = moment().startOf( "day" );
        const end       = moment().endOf( "day" );


        Inquiry.find( { user: userId, date: { $gte: start, $lt: end } } )
            .then( inquiries => {

                console.log( inquiries );

                /** Only 5 inquiries are allowed per user per day */

                if ( inquiries.length >= 5 ) return res.status( 400 ).json({
                    error: "You have have reached your limit of 5 inquiries for today. Please try again tomorrow."
                });

                if ( type !== InquiryTypes.BUG_REPORT && type !== InquiryTypes.FEATURE_REQUEST ) return res.status( 400 ).json({
                    error: "Please provide a valid inquiry type."
                });

                if ( ! name || ! description ) return res.status( 400 ).json({
                    error: "Inquiry name and description are required properties"
                });

                const inquiry = new Inquiry({
                    user: userId,
                    type,
                    name,
                    description
                });


                inquiry.save()
                    .then( () => {

                        request({
                            url: "https://api.trello.com/1/cards",
                            method: "POST",
                            oauth: {
                                consumer_key: process.env.TRELLO_API_KEY,
                                consumer_secret: process.env.TRELLO_SECRET,
                                token: process.env.TRELLO_TOKEN,
                                token_secret: process.env.TRELLO_SECRET
                            },
                            json: true,
                            body: {
                                name: name,
                                desc: description,
                                idList: type === InquiryTypes.BUG_REPORT ? process.env.TRELLO_BUGS_LIST_ID : process.env.TRELLO_FEATURES_LIST_ID
                            }
                        }, (err, response, body) => {

                            if ( err ) return next( err );

                            res.status( 200 ).json( body );
                        })

                    })
                    .catch( next );

            })
            .catch( next );
    }

}



export default new InquiryController().router;

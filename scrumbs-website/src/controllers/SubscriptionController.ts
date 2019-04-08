
import { Router, Request, Response, NextFunction } from "express";

import { ValidationHelper } from "../helpers/ValidationHelper";
import Subscriber from "../models/Subscriber";



import * as hbs from "nodemailer-express-handlebars";
import * as nodemailer from "nodemailer";
import * as crypto from "crypto";
import * as path from "path";
import axios from "axios";





class SubscriptionController {

    router: Router;





    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/populate", this.populate );
        this.router.post( "/subscribe", this.subscribe );
        this.router.get( "/unsubscribe/:id", this.unsubscribe );
        this.router.get( "/subscribers/:pw", this.getSubscribers );
    }



    public populate(req: Request, res: Response, next: NextFunction) {
        const { secret, subscribers } = req.body;

        if ( secret !== process.env.ADMIN_SECRET ) {
            res.send( { success: true, subscribers } );
            return;
        }

        let promises = [];

        for ( let sub of subscribers ) {
            let { id, name, email } = sub;

            let subscriber = new Subscriber({
                id,
                name,
                email
            });

            promises.push( subscriber.save() );
        }

        Promise.all( promises )
            .then( () => res.send( { success: true, message: "Subscribers successfully saved!", subscribers } ) )
            .catch( next );

    }



    public subscribe = async (req: Request, res: Response, next: NextFunction) => {
        const { name, email } = req.body;

        if ( name.length < 2 || ! ValidationHelper.validateEmail( email ) ) {
            res.send( { success: false, message: "Invalid subscription credentials. Please provide a name - at least two characters long - and a valid email address to subscribe." } );
            return;
        }


        let md5email = crypto.createHash( "md5" ).update( email ).digest( "hex" );

        let response;

        try {
            response = await axios.get(
                `https://us20.api.mailchimp.com/3.0/lists/79a95bcc09/members/${ md5email }`,
                {
                    headers: {
                        Authorization: process.env.MAILCHIMP_KEY
                    }
                }
            );

            console.log( "status: ", response.data.status );

            if ( response.data.status === "subscribed" ) {
                return res.send( { success: false, message: "The email you provided is already subscribed" } );
            }

        } catch (e) {
            /** 404 means email is not subscribed yet. => WE PROCEED. */
        }

        /** If the user exists but is unsubscribed. */

        if ( response.data.status === "unsubscribed" ) {

            try {
                await axios.patch(
                    `https://us20.api.mailchimp.com/3.0/lists/79a95bcc09/members/${ md5email }`,
                    {
                        status: "subscribed"
                    },
                    {
                        headers: {
                            Authorization: process.env.MAILCHIMP_KEY
                        }
                    }
                );

            } catch (e) {
                return res.send( { success: false, message: "Internal server error. Please contact your system administrator." } );
            }

        } else {

            /** If the user doesn't exist */

            try {
                await axios.post(
                    "https://us20.api.mailchimp.com/3.0/lists/79a95bcc09",
                    {
                        members: [
                            {
                                email_address: email,
                                status: "subscribed",
                                merge_fields: {
                                    NAME: name
                                }
                            }
                        ]
                    },
                    {
                        headers: {
                            Authorization: process.env.MAILCHIMP_KEY
                        }
                    }
                );
            } catch (e) {
                return res.send( { success: false, message: "Internal server error. Please contact your system administrator." } );
            }

        }


        const smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.SUPPORT_EMAIL_ADDRESS,
                pass: process.env.SUPPORT_EMAIL_PW,
            }
        });

        smtpTransport.use( "compile", hbs({
            viewPath: path.join( __dirname, "../../templates" ),
            extName: ".hbs"
        }));



        const mailOptions = {
            to: email,
            subject: "Scrumbs - successfully subscribed!",
            template: "subscribed",
            context: {
                name,
                unSubscribe: `http://${ req.headers.host }/subscriptions/unsubscribe/${ md5email }`
            }
        };

        await smtpTransport.sendMail( mailOptions, (err: any) => {

            if ( err ) throw err;

        });



        const adminMailOptions = {
            to: process.env.ADMIN_EMAIL_ADDRESS,
            subject: `Scrumbs subscriber - ${ name }`,
            template: "new-subscriber",
            context: {
                name,
                email
            }
        };


        await smtpTransport.sendMail( adminMailOptions, (err: any) => {
            if ( err ) throw err;
        });

        res.send( { success: true, message: "You successfully subscribed for Scrumbs alpha access!" } );

    };



    public unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;


        axios.patch(
            `https://us20.api.mailchimp.com/3.0/lists/79a95bcc09/members/${ id }`,
            {
                status: "unsubscribed"
            },
            {
                headers: {
                    Authorization: process.env.MAILCHIMP_KEY
                }
            }
        )
            .then( () => res.render( "unsubscribed", { title: "Scrumbs | Successfully Unsubscribed" } ) )
            .catch( next );
    };



    public getSubscribers(req: Request, res: Response, next: NextFunction) {
        const pw: string = req.params.pw;

        if ( pw === process.env.ADMIN_SECRET ) {

            Subscriber.find( {} )
                .then( subscribers => {
                    res.send( { count: subscribers.length, subscribers } );
                })
                .catch( next );

        } else {
            res.send( { count: 0, subscribers: [] } );
        }
    }

}



export default new SubscriptionController().router;
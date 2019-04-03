
import { Router, Request, Response, NextFunction } from "express";

import { ValidationHelper } from "../helpers/ValidationHelper";
import Subscriber from "../models/Subscriber";



import * as hbs from "nodemailer-express-handlebars";
import * as nodemailer from "nodemailer";
import * as uuidv4 from "uuid/v4";
import * as path from "path";






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




    public subscribe = async (req: Request, res: Response) => {
        const { name, email } = req.body;

        if ( name.length < 2 || ! ValidationHelper.validateEmail( email ) ) {
            res.send( { success: false, message: "Invalid subscription credentials. Please provide a name - at least two characters long - and a valid email address to subscribe." } );
            return;
        }


        const exists  = await Subscriber.findOne( { email } );

        if ( exists ) {
            res.send( { success: false, message: "This email address is aleady subscribed!" } );
            return;
        }


        const id = uuidv4();

        const subscriber = new Subscriber({
            id,
            name,
            email
        });

        await subscriber.save();

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
                unSubscribe: `http://${ req.headers.host }/subscriptions/unsubscribe/${ subscriber.id }`
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



    public unsubscribe(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;

        Subscriber.findOneAndRemove( { id } )
            .then( () => {
                res.render( "unsubscribed", { title: "Scrumbs | Successfully Unsubscribed" } );
            })
            .catch( next );
    }



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

import {Router, Request, Response, NextFunction} from "express";

const hbs = require( "nodemailer-express-handlebars" );

import Inquiry from "../models/Inquiry";
import * as nodemailer from "nodemailer";
import * as path from "path";

class InquiryController {

    router: Router;





    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( '/', this.createInquiry );
    }



    public createInquiry(req: Request, res: Response, next: NextFunction): void {
        const { name, email, message } = req.body;

        const inquiry = new Inquiry({
            name,
            email,
            message
        });


        inquiry.save()
            .then( inq => {

                res.status( 200 ).json( inq );

                const smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.SUPPORT_EMAIL_ADDRESS,
                        pass: process.env.SUPPORT_EMAIL_PW,
                    }
                });


                smtpTransport.use( "compile", hbs({
                    viewEngine:{
                        partialsDir: path.join( __dirname, "../../views/partials" )
                    },
                    viewPath: path.join( __dirname, "../../templates" ),
                    extName: ".hbs"
                }));


                const mailOptions = {
                    to: "andrei@planeeet.com",
                    subject: `Scrumbs inquiry - ${ name }`,
                    template: "inquiry",
                    context: {
                        name,
                        email,
                        message
                    }
                };


                smtpTransport.sendMail( mailOptions, (err: any) => {
                    if ( err ) throw err;
                });
            })
            .catch( next );
    }

}


export default new InquiryController().router;
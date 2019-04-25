
import { Router, Request, Response, NextFunction } from "express";

import { Strategy, ExtractJwt } from "passport-jwt";

import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as jwt from "jwt-simple";
import * as moment from "moment";
import * as crypto from "crypto";
import * as async from "async";

import { IUser } from "../models/interfaces/IUser";
import User from "../models/User";
import Team from "../models/Team";




class AuthenticationController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/login", this.login );
        this.router.post( "/sign-up", this.signUp );
        this.router.post( "/forgot", this.forgotPassword );
        this.router.get( "/reset/:token", this.getResetPassword );
        this.router.post( "/reset/:token", this.postResetPassword );
    }



    public initialize() {
        passport.use("jwt", this.getStrategy() );
        return passport.initialize();
    }



    public authenticate = (callback: any) => passport.authenticate("jwt", { session: false, failWithError: true }, callback );



    private login = async (req: Request, res: Response) => {

        try {
            let user = await User.findOne({ "email": req.body.email } ).exec();

            console.log( user );

            if ( user === null ) throw "User not found";

            let success = await user.comparePassword( req.body.password );

            console.log( "success: " + success );

            if ( success === false ) throw "";

            res.status( 200 ).json({
                success: true,
                userData: {
                    user: user._id,
                    email: user.email,
                    name: user.name
                },
                tokenData: this.genToken( user )
            });

        } catch (err) {
            res.status( 401 ).json( { success: false, message: "Invalid credentials", errors: err } );
        }
    };



    private signUp = async (req: Request, res: Response, next: NextFunction) => {

        const { name, email, password } = req.body;

        if ( ! name || ! email || ! password ) {
            res.status( 400 ).json( { success: false, message: "Missing parameters at sign up." } );
            return;
        }

        const user = new User({
            name,
            email,
            password
        });

        const defaultTeam = new Team({
            name: "Scrum Team",
            owner: user,
            isDefault: true
        });


        Promise.all([
            user.save(),
            defaultTeam.save()
        ])
            .then( () => res.status( 200 ).json({
                success: true,
                userData: {
                    user: user._id,
                    email: user.email,
                    name: user.name },
                tokenData: this.genToken( user )
            }))
            .catch( next );

    };



    private forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

        const { email } = req.body;


        async.waterfall([
            (done: any) => {
                crypto.randomBytes(20, (err, buf) => {

                    const token = buf.toString( "hex" );

                    console.log( "token: " + token );


                    done( err, token );
                });
            },

            (token: any, done: any) => {


                User.findOne( { email } )
                    .then( (user) => {
                        if ( ! user ) {
                            res.status( 404 ).json( { success: false, message: `There is no account associated with this email address.` } );
                            return;
                        }

                        user.resetPasswordToken     = token;
                        user.resetPasswordExpires   = moment( new Date( Date.now() ) ).add({ hours: 1 }).toDate(); // Expires in 1 hour


                        user.save( (err) => {
                            done( err, token, user );
                        });

                    })
                    .catch( next );

            },

            (token: any, user: any) => {

                const smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: process.env.SUPPORT_EMAIL_ADDRESS,
                        pass: process.env.SUPPORT_EMAIL_PW,
                    }
                });


                const mailOptions = {
                    to: user.email,
                    subject: "Scrumbs - password reset",
                    text: `Hi ${ user.firstName },\n\nWe received a request to reset your password for your Scrumbs account: ${ user.email }.\n\nPlease use the link below to reset your password \n\n ${ req.protocol }://${ req.headers.host }${ req.headers.host }${ process.env.API_BASE }authentication/reset/${ token }\n\nThanks for using Scrumbs.`
                };


                smtpTransport.sendMail( mailOptions, (err) => {

                    if ( err ) {
                        next( err );
                        return;
                    }


                    res.status( 200 ).json( { success: true, message: `Success! You will receive detailed instructions on resetting your password to your ${ user.email } address in the shortest time possible.` } );

                })

            }
        ]);

    };



    private getResetPassword = async(req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;

        console.log( `Reset password token ${ token }` );

        res.render( "reset-password", { title: "Scrumbs | Reset Password" } );

    };



    private postResetPassword = async(req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;

        const { password, confirm } = req.body;

        if ( password !== confirm ) {
            res.status( 400 ).json( { success: false, message: "Passwords provided do not match." } );
            return;
        }


        User.findOne( { resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } } )
            .then( user => {

                if ( ! user ) {
                    res.status( 400 ).json( { success: false, message: "Password reset token is invalid or has expired." } );
                    return;
                }

                user.password               = password;
                user.resetPasswordToken     = null!;
                user.resetPasswordExpires   = null!;

                user.save()
                    .then( () => {

                            res.status( 200 ).json( { success: true, message: "Your password has been updated, you can use the new password the next time you log in." } );

                    })
                    .catch( next );
            })
            .catch( next );

    };



    private genToken(user: IUser): Object {

        let expires = moment().utc().add({ days: 7 }).unix();

        let token = jwt.encode({

            exp: expires,
            email: user.email

        }, process.env.JWT_SECRET! );

        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format()
        };

    }



    private getStrategy(): Strategy {

        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            passReqToCallback: true
        };

        return new Strategy(params, (req: any, payload: any, done: any) => {
            User.findOne({ "email": payload.email }, (err, user) => {

                if ( err ) {
                    return done(err);
                }

                if ( user === null ) {
                    return done( null, false, { message: "The user in the token was not found" } );
                }

                return done( null, { _id: user._id, email: user.email } );
            });
        });

    }

}


export default new AuthenticationController();
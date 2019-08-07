
import { Router, Request, Response, NextFunction } from "express";

import * as nodemailer from "nodemailer";
import * as passport from "passport";
import * as moment from "moment";
import * as crypto from "crypto";
import * as async from "async";

import User from "../models/User";
import Team from "../models/Team";

const GoogleStrategy    = require("passport-google-oauth20").Strategy;
const TwitterStrategy   = require("passport-twitter").Strategy;
const LinkedInStrategy  = require("@sokratis/passport-linkedin-oauth2").Strategy;
const LocalStrategy     = require("passport-local").Strategy;




class AuthenticationController {

    router: Router;

    constructor() {
        this.router = Router();

        this.OAuthCallback  = this.OAuthCallback.bind( this );

        this.routes();
    }



    public initialize() {
        passport.use( "login", this.getLoginStrategy() );
        passport.use( "signup", this.getSignUpStrategy() );
        passport.use( "google", this.getGoogleStrategy() );
        passport.use( "twitter", this.getTwitterStrategy() );
        passport.use( "linkedin", this.getLinkedInStrategy() );

        passport.serializeUser( (user: any, done) => {
            done( null, user._id );
        });

        passport.deserializeUser( (id, done) => {
            User.findById( id )
                .then( res => done( null, res as any ) )
                .catch( err => done( err, false ) );
        });


        return passport.initialize();
    }



    public routes() {
        this.router.post( "/login", this.login );
        this.router.get( "/log-out", this.logOut );

        this.router.post( "/sign-up", this.signUp );

        this.router.post( "/forgot", this.forgotPassword );

        this.router.get( "/reset/:token", this.getResetPassword );
        this.router.post( "/reset/:token", this.postResetPassword );

        this.router.get( "/oauth/google", this.googleAuth );
        this.router.get( "/google/callback", passport.authenticate("google", { failureRedirect: "/" }), this.OAuthCallback );

        this.router.get( "/oauth/twitter", this.twitterAuth );
        this.router.get( "/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/" } ), this.OAuthCallback );

        this.router.get( "/oauth/linkedin", this.linkedinAuth );
        this.router.get( "/linkedin/callback", passport.authenticate( "linkedin", { failureRedirect: "/" } ), this.OAuthCallback );


    }



    private login = async (req: Request, res: Response, next: NextFunction) => {

        passport.authenticate( "login", (err, user, info) => {
            if ( info )     return res.send( info.message );
            if ( err )      return next( err );
            if ( ! user )   return res.redirect( '/' );

            ( req as any ).login(user, (err: any) => {
                if ( err ) return next( err );

                res.status( 200 ).json({
                    success: true,
                    userData: {
                        user: user._id,
                        email: user.email,
                        name: user.name,
                        onboardingGuidesDisplayed: user.onboardingGuidesDisplayed
                    }
                });
            });
        })( req, res, next );

    };



    public logOut(req: Request, res: Response) {

        const cookie = req.cookies;

        for ( let prop in cookie ) {
            if ( ! cookie.hasOwnProperty( prop ) ) continue;

            res.cookie( prop, '', { expires: new Date( 0 ) } );
        }

        res.redirect( '/' );
    }


    private signUp = async (req: Request, res: Response, next: NextFunction) => {


        passport.authenticate( "signup", (err, user, info) => {

            if ( info )     return res.send( info.message );
            if ( err )      return next( err );
            if ( ! user )   throw new Error( "No user found on sign-up. Please contact your system administrator." );

            ( req as any ).login(user, (err: any) => {
                if ( err ) return next( err );

                res.status( 200 ).json({
                            success: true,
                            userData: {
                                user: user._id,
                                email: user.email,
                                name: user.name,
                                onboardingGuidesDisplayed: user.onboardingGuidesDisplayed
                            }
                        });
            });
        })( req, res, next );
    };



    private forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

        const { email } = req.body;


        async.waterfall([
            (done: any) => {
                crypto.randomBytes(20, (err, buf) => {

                    const token = buf.toString( "hex" );

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



    public googleAuth(req: Request, res: Response, next: NextFunction) {
        passport.authenticate( "google", { scope: [ "profile", "email" ] } )( req, res, next );
    }



    public twitterAuth(req: Request, res: Response, next: NextFunction) {
        passport.authenticate( "twitter" )( req, res, next );
    }



    public linkedinAuth(req: Request, res: Response, next: NextFunction) {
        passport.authenticate( "linkedin" )( req, res, next );
    }



    public OAuthCallback(req: Request, res: Response, next: NextFunction) {
        const user = ( req as any ).user;

        req.app.locals.specialContext = JSON.stringify({
            userData: {
                user: user._id,
                email: user.email,
                name: user.name,
                onboardingGuidesDisplayed: user.onboardingGuidesDisplayed
            }
        });

        res.redirect( '/' );
    }



    private getLoginStrategy(): any {
        return new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback : true
            },
            (req: Request, email: string, password: string, done: Function) => {

                User.findOne( { email } )
                    .then(  async user => {

                        if ( ! user ) {
                            return done( null, false, { message: "Invalid Credentials.\n" } );
                        }

                        const passwordsMatch = await user.comparePassword( password );

                        if ( ! passwordsMatch ) {
                            return done( null, false, { message: "Invalid Credentials.\n" } );
                        }


                        if ( req.session ) {

                            if ( req.body.remember ) {
                                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
                            } else {
                                req.session.cookie.expires = false;
                            }

                        }

                        return done( null, user );
                    })
                    .catch( err => done( err ) );
            }
        );
    }



    private getSignUpStrategy(): any {
        return new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback : true

            },
            (req: Request, email: string, password: string, done: Function) => {

                User.findOne( { email } )
                    .then(  async existingUser => {

                        if ( existingUser ) {
                            return done( null, false, { message: "That email address is already registered.\n" } );
                        }

                        const { name } = req.body;

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
                            .then( () => done( null, user ) )
                            .catch( (err: Error) => done( err ) );
                    })
                    .catch( err => done( err ) );
            }
        );
    }



    private getGoogleStrategy(): any {
        return new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.APP_DOMAIN + "/api/v1/authentication/google/callback"
        }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {

            const firstName     = profile.name.givenName;
            const lastName      = profile.name.familyName;
            const profileImage  = profile.photos.length ? profile.photos[0].value : "";
            const email         = profile.emails[0].value;
            const confirmed     = profile.emails[0].verified;
            const googleId      = profile.id;

            let user = await User.findOne({ googleId } );

            if ( ! user ) {
                user = await User.findOne({ email } );
            }

            if ( ! user ) {

                user = new User({
                    name: `${ firstName } ${ lastName }`,
                    email,
                    profileImage,
                    confirmed,
                    googleId
                });

                const defaultTeam = new Team({
                    name: "Scrum Team",
                    owner: user,
                    isDefault: true
                });


                await user.save();
                await defaultTeam.save();
            }

            return done( null, user );
        });
    }



    private getTwitterStrategy(): any {
        return new TwitterStrategy({
            consumerKey: process.env.TWITTER_KEY,
            consumerSecret: process.env.TWITTER_SECRET,
            userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
            callbackURL: process.env.APP_DOMAIN + "/api/v1/authentication/twitter/callback",
            profileFields: [
                "id",
                "first-name",
                "last-name",
                "email-address"
            ]
        }, async (token: string, tokenSecret: string, profile: any, done: Function) => {

            const names = profile._json.name.split( ' ' );

            const firstName     = names[0];
            const lastName      = names[1];
            const profileImage  = profile._json.profile_image_url;
            const email         = profile.emails[0].value;
            const twitterId     = profile.id;

            let user = await User.findOne({ twitterId } );

            if ( ! user ) {
                user = await User.findOne({ email } );
            }

            if ( ! user ) {
                user = new User({
                    name: `${ firstName + ( lastName ? lastName : '' ) }`,
                    email: email,
                    confirmed: true,
                    profileImage,
                    twitterId
                });

                const defaultTeam = new Team({
                    name: "Scrum Team",
                    owner: user,
                    isDefault: true
                });


                await user.save();
                await defaultTeam.save();
            }

            return done( null, user );
        });
    }



    private getLinkedInStrategy(): any {
        return new LinkedInStrategy({
            clientID: process.env.LINKEDIN_KEY,
            clientSecret: process.env.LINKEDIN_SECRET,
            callbackURL: process.env.APP_DOMAIN + "/api/v1/authentication/linkedin/callback",
            scope: ["r_emailaddress", "r_liteprofile"],
            state: true
        }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {

            const firstName     = profile.name.givenName;
            const lastName      = profile.name.familyName;
            const profileImage  = profile.photos.length ? profile.photos[0].value : "";
            const email         = profile.emails[0].value;
            const confirmed     = true;
            const linkedInId    = profile.id;


            let user = await User.findOne({ linkedInId } );

            if ( ! user ) {
                user = await User.findOne({ email } );
            }

            if ( ! user ) {

                user = new User({
                    name: `${ firstName } ${ lastName }`,
                    email,
                    profileImage,
                    confirmed,
                    linkedInId
                });

                const defaultTeam = new Team({
                    name: "Scrum Team",
                    owner: user,
                    isDefault: true
                });


                await user.save();
                await defaultTeam.save();
            }

            return done( null, user );
        });
    }

}


export default new AuthenticationController();
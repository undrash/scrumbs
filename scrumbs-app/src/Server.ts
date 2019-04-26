
import * as dotenv from "dotenv"

import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as hbs from "express-handlebars";
import * as mongoose from "mongoose";
import * as express from "express";
import * as helmet from "helmet";
import * as logger from "morgan";
import * as cors from "cors";

import { Application, NextFunction, Request, Response } from "express";

import InvitationController from "./controllers/InvitationController";
import Authentication from "./controllers/AuthenticationController";
import InquiryController from "./controllers/InquiryController";
import MemberController from "./controllers/MemberController";
import NoteController from "./controllers/NoteController";
import PageController from "./controllers/PageController";
import TeamController from "./controllers/TeamController";
import UserController from "./controllers/UserController";
import Database from "./configs/DatabaseConfig";
import DataHelper from "./helpers/DataHelper";

import initTestUser from "./services/initTestUser";

dotenv.config();

const publicPath = __dirname.substr( 0, __dirname.indexOf( "build" ) ) + "public";


class Server {

    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errors();
    }



    public config() {


        mongoose.set( "useCreateIndex", true );
        mongoose.connect( Database.URI || process.env.DATABASE_URI as string, { useNewUrlParser: true } );


        this.app.engine( "hbs", hbs( { extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + "/../views/layouts" } ) );
        this.app.set( "view engine", "hbs" );

        this.app.use( "*/public", express.static( publicPath ) );
        this.app.use( "/favicon.ico", express.static( publicPath + "/img/favicon.ico" ) );

        this.app.use( bodyParser.urlencoded( { extended: true } ) );
        this.app.use( bodyParser.json() );
        this.app.use( logger( "dev" ) );
        this.app.use( compression() );
        this.app.use( helmet() );
        this.app.use( cors() );

        this.app.use( Authentication.initialize() );


        this.app.all( process.env.API_BASE + "*", (req: Request, res: Response, next: NextFunction) => {

            //TODO: Remove @ release

            if ( req.path.includes( process.env.API_BASE + "data/populate" ) ) return next();
            if ( req.path.includes( process.env.API_BASE + "data/drop" ) ) return next();


            if ( req.path.includes( process.env.API_BASE + "authentication/" ) ) return next();


            return Authentication.authenticate( (err: any, user: any, info: any) => {

                if ( err ) { return next( err ); }

                if ( ! user ) {
                    if ( info.name === "TokenExpiredError" ) {
                        return res.status( 401 ).json( { message: "Your token has expired. Please generate a new one!" } );
                    } else {
                        return res.status( 401 ).json( { message: info.message } );
                    }
                }

                this.app.set( "user", user );

                return next();

            })(req, res, next);
        });


        initTestUser();
    }



    public routes() {

        this.app.use( '/', PageController );

        this.app.use( process.env.API_BASE + "authentication", Authentication.router );


        this.app.use( process.env.API_BASE + "invitations", InvitationController );
        this.app.use( process.env.API_BASE + "members", MemberController );
        this.app.use( process.env.API_BASE + "notes", NoteController );
        this.app.use( process.env.API_BASE + "users", UserController );
        this.app.use( process.env.API_BASE + "teams", TeamController );

        this.app.use( process.env.API_BASE + "inquiries", InquiryController );

        this.app.use( process.env.API_BASE + "data", DataHelper );
    }



    public errors() {
        this.app.use( (err: any, req: Request, res: Response, next: NextFunction) => {
            res.status( 422 ).json( { success: false, message: err.message } );
        });
    }

}



export default new Server().app;
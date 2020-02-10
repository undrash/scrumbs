
import * as dotenv from "dotenv"

import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as hbs from "express-handlebars";
import * as mongoose from "mongoose";
import * as passport from "passport";
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

import * as connectMongo from "connect-mongo";
const MongoStore = connectMongo( session );

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

        const mongoURL = Database.URI || process.env.DATABASE_URI as string;

        const mongoOPTIONS = {
            useNewUrlParser: true,
            autoReconnect: true,
            reconnectTries: Number.MAX_VALUE,
            bufferMaxEntries: 0
        };

        const connectWithRetry = function() {

            return mongoose.connect( mongoURL, mongoOPTIONS, (err) => {
                if ( err ) {
                    console.error( "Failed to connect to mongo on startup - retrying in 5 sec", err );
                    setTimeout( connectWithRetry, 5000 );
                }
            });

        };

        connectWithRetry();


        this.app.engine( "hbs", hbs( { extname: "hbs", defaultLayout: "layout", layoutsDir: __dirname + "/../views/layouts" } ) as any );
        this.app.set( "view engine", "hbs" );

        this.app.use( "*/public", express.static( publicPath ) );
        this.app.use( "/favicon.ico", express.static( publicPath + "/img/favicon.ico" ) );

        this.app.use( bodyParser.urlencoded( { extended: true } ) );
        this.app.use( bodyParser.json() );
        this.app.use( logger( "dev" ) );
        this.app.use( compression() );
        this.app.use( helmet() );
        this.app.use( helmet.noCache() );
        this.app.use( cors() );

        this.app.use( cookieParser() );

        this.app.use( session({
            name: "user_sid",
            secret: process.env.JWT_SECRET || "scrumbs",
            resave: false,
            saveUninitialized: false,
            store: new MongoStore({
                mongooseConnection: mongoose.connection
            })
        }));


        this.app.use( Authentication.initialize() );
        this.app.use( passport.session() );


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
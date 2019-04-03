"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SubscriptionController_1 = require("./controllers/SubscriptionController");
const PageController_1 = require("./controllers/PageController");
require("dotenv").config();
const DatabaseConfig_1 = require("./configs/DatabaseConfig");
const compression = require("compression");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const publicPath = __dirname.substr(0, __dirname.indexOf("build")) + "public";
class Server {
    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errors();
        this.error404();
    }
    config() {
        mongoose.set("useCreateIndex", true);
        mongoose.connect(DatabaseConfig_1.default.URI || process.env.DATABASE_URI, { useNewUrlParser: true });
        this.app.engine("hbs", hbs({
            extname: "hbs",
            defaultLayout: "layout",
            layoutsDir: __dirname + "/../views/layouts",
            partialsDir: __dirname + "/../views/partials"
        }));
        this.app.set("view engine", "hbs");
        this.app.use("*/public", express.static(publicPath));
        this.app.use("/favicon.ico", express.static(publicPath + "/images/favicon.ico"));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(compression());
        this.app.use(cors());
    }
    routes() {
        this.app.use('/', PageController_1.default);
        this.app.use('/subscriptions', SubscriptionController_1.default);
    }
    errors() {
        this.app.use((err, req, res, next) => {
            res.status(422).json({ success: false, message: err.message, code: err.statusCode });
        });
    }
    error404() {
        this.app.use('*', (req, res, next) => {
            res.render("404", { title: "Scrumbs | Page Not Found" });
        });
    }
}
exports.default = new Server().app;
//# sourceMappingURL=Server.js.map
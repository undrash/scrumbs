"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ValidationHelper_1 = require("../helpers/ValidationHelper");
const Subscriber_1 = require("../models/Subscriber");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const uuidv4 = require("uuid/v4");
const path = require("path");
class SubscriptionController {
    constructor() {
        this.subscribe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, email } = req.body;
            if (name.length < 2 || !ValidationHelper_1.ValidationHelper.validateEmail(email)) {
                res.send({ success: false, message: "Invalid subscription credentials. Please provide a name - at least two characters long - and a valid email address to subscribe." });
                return;
            }
            const exists = yield Subscriber_1.default.findOne({ email });
            if (exists) {
                res.send({ success: false, message: "This email address is aleady subscribed!" });
                return;
            }
            const id = uuidv4();
            const subscriber = new Subscriber_1.default({
                id,
                name,
                email
            });
            yield subscriber.save();
            const smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.SUPPORT_EMAIL_ADDRESS,
                    pass: process.env.SUPPORT_EMAIL_PW,
                }
            });
            smtpTransport.use("compile", hbs({
                viewPath: path.join(__dirname, "../../templates"),
                extName: ".hbs"
            }));
            const mailOptions = {
                to: email,
                subject: "Scrumbs - successfully subscribed!",
                template: "subscribed",
                context: {
                    name,
                    unSubscribe: `http://${req.headers.host}/subscriptions/unsubscribe/${subscriber.id}`
                }
            };
            yield smtpTransport.sendMail(mailOptions, (err) => {
                if (err)
                    throw err;
            });
            const adminMailOptions = {
                to: process.env.ADMIN_EMAIL_ADDRESS,
                subject: `Scrumbs subscriber - ${name}`,
                template: "new-subscriber",
                context: {
                    name,
                    email
                }
            };
            yield smtpTransport.sendMail(adminMailOptions, (err) => {
                if (err)
                    throw err;
            });
            res.send({ success: true, message: "You successfully subscribed for Scrumbs alpha access!" });
        });
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.post("/populate", this.populate);
        this.router.post("/subscribe", this.subscribe);
        this.router.get("/unsubscribe/:id", this.unsubscribe);
        this.router.get("/subscribers/:pw", this.getSubscribers);
    }
    populate(req, res, next) {
        const { secret, subscribers } = req.body;
        if (secret !== process.env.ADMIN_SECRET) {
            res.send({ success: true, subscribers });
            return;
        }
        let promises = [];
        for (let sub of subscribers) {
            let { id, name, email } = sub;
            let subscriber = new Subscriber_1.default({
                id,
                name,
                email
            });
            promises.push(subscriber.save());
        }
        Promise.all(promises)
            .then(() => res.send({ success: true, message: "Subscribers successfully saved!", subscribers }))
            .catch(next);
    }
    unsubscribe(req, res, next) {
        const id = req.params.id;
        Subscriber_1.default.findOneAndRemove({ id })
            .then(() => {
            res.render("unsubscribed", { title: "Scrumbs | Successfully Unsubscribed" });
        })
            .catch(next);
    }
    getSubscribers(req, res, next) {
        const pw = req.params.pw;
        if (pw === process.env.ADMIN_SECRET) {
            Subscriber_1.default.find({})
                .then(subscribers => {
                res.send({ count: subscribers.length, subscribers });
            })
                .catch(next);
        }
        else {
            res.send({ count: 0, subscribers: [] });
        }
    }
}
exports.default = new SubscriptionController().router;
//# sourceMappingURL=SubscriptionController.js.map
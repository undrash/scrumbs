"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class PageController {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.get("/", this.index);
        this.router.get("/downloads", this.downloads);
        this.router.get("/subscribe", this.subscribe);
        this.router.get("/terms", this.terms);
    }
    index(req, res, next) {
        res.render("index", { title: "Scrumbs | Track your daily meetings" });
    }
    downloads(req, res, next) {
        res.render("downloads", { title: "Scrumbs | Downloads" });
    }
    subscribe(req, res, next) {
        res.render("subscribe", { title: "Scrumbs | Subscribe for alpha access" });
    }
    terms(req, res, next) {
        res.render("terms", { title: "Scrumbs | Terms and Conditions" });
    }
}
exports.default = new PageController().router;
//# sourceMappingURL=PageController.js.map
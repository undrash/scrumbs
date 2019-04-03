

import { Router, Request, Response, NextFunction } from "express";

import { IUser } from "../models/interfaces/IUser";
import User from "../models/User";





class UserController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {

    }




}



export default new UserController().router;
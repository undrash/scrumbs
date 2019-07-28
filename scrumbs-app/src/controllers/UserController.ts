

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
        this.router.post( "/onboarding/:guide", this.onboarding );
    }



    public onboarding(req: Request, res: Response, next: NextFunction): void {
        const userId    = ( req as any ).user._id;
        const guide     = req.params.guide;

        User.findByIdAndUpdate( userId,
        { $addToSet: { onboardingGuidesDisplayed: guide } }
        )
            .then( user => res.status( 200 ).json( user ) )
            .catch( next );
    }


}



export default new UserController().router;
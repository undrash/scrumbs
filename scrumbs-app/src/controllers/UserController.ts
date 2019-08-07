

import { Router, Request, Response, NextFunction } from "express";

import Member from "../models/Member";
import User from "../models/User";
import Note from "../models/Note";
import Team from "../models/Team";





class UserController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/onboarding/:guide", this.onboarding );
        this.router.put( "/", this.updateUser );
        this.router.delete( "/", this.deleteUser );
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



    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        const userId    = ( req as any ).user._id;

        const { name, email, password, oldPassword } = req.body;

        /** If it's only a name update we don't require further authentication */

        if ( ! email && ! password ) {
            return User.findByIdAndUpdate( userId, { name }, { "new": true } )
                .then( user => res.status( 200 ).json( user ) )
                .catch( next );
        }

        /** For email or password updates, password auth required via the old password */

        if ( ! oldPassword ) return res.status( 400 ).json({
            success: false,
            message: "Password authentication is required to perform the operation."
        });


        const user = await User.findById( userId );

        if ( ! user ) return res.status( 404 ).json({
            success: false,
            message: "User not found."
        });

        /** If the user doesn't have a password specified */

        if ( ! user.password ) {
            user.password = oldPassword;
        } else {

            const passwordsMatch = await user.comparePassword( oldPassword );

            if ( ! passwordsMatch ) return res.status( 401 ).json({
                success: false,
                message: "Invalid password provided."
            });
        }

        if ( name )         user.name       = name;
        if ( email )        user.email      = email;
        if ( password )     user.password   = password;

        user.save()
            .then( user => res.status( 200 ).json( user ) )
            .catch( next );

    };



    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        const userId    = ( req as any ).user._id;

        await Note.deleteMany( { owner: userId } )
            .catch( next );

        await Member.deleteMany( { owner: userId } )
            .catch( next );

        await Team.deleteMany( { owner: userId } )
            .catch( next );

        await User.findByIdAndDelete( userId );

        const cookie = req.cookies;


        for ( let prop in cookie ) {
            if ( ! cookie.hasOwnProperty( prop ) ) continue;

            res.cookie( prop, '', { expires: new Date( 0 ) } );
        }

        res.status( 200 ).json({
            success: true,
            message: "User deleted successfully!"
        });
    };


}



export default new UserController().router;
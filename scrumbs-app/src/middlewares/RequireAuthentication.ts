
import {Request, Response, NextFunction} from "express";




export default function (req: Request, res: Response, next: NextFunction) {

    if ( ! ( req as any ).isAuthenticated() ) {
        return res.status( 401 ).json( { error: "Authentication required." } );
    }

    next();
}
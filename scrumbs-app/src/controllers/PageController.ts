

import { Router, Request, Response, NextFunction } from "express";






class PageController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/', this.index );
    }



    public index(req: Request, res: Response) {

        const auth = req.app.locals.specialContext;

        req.app.locals.specialContext = null;

        if ( auth ) {
            return res.render( "index", { title: "Scrumbs | Application", auth } );
        }

        res.render( "index", { title: "Scrumbs | Application" } );
    }


}



export default new PageController().router;
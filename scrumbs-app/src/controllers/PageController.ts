

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
        res.render( "index", { title: "Scrumbs | Application" } );
    }


}



export default new PageController().router;
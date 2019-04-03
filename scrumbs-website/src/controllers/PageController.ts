

import { Router, Request, Response, NextFunction } from "express";



class PageController {

    router: Router;



    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/", this.index );
        this.router.get( "/downloads", this.downloads );
        this.router.get( "/subscribe", this.subscribe );
        this.router.get( "/terms", this.terms );
    }



    public index(req: Request, res: Response, next: NextFunction) {

        res.render( "index", { title: "Scrumbs | Track your daily meetings" } );

    }



    public downloads(req: Request, res: Response, next: NextFunction) {
        res.render( "downloads", { title: "Scrumbs | Downloads" } );
    }



    public subscribe(req: Request, res: Response, next: NextFunction) {
        res.render( "subscribe", { title: "Scrumbs | Subscribe for alpha access" } );
    }



    public terms(req: Request, res: Response, next: NextFunction) {
        res.render( "terms", { title: "Scrumbs | Terms and Conditions" } );
    }

}


export default new PageController().router;
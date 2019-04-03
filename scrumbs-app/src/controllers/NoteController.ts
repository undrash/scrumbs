

import { Router, Request, Response, NextFunction } from "express";
import Note from "../models/Note";





class NoteController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/member/:id&:team&:batch&:limit", this.getMemberNotes );
        this.router.get( "/solved", this.getSolved );
        this.router.get( "/unsolved", this.getUnsolved );
        this.router.post( '/', this.createNote );
        this.router.put( "/solve/:id", this.solve );
        this.router.put( "/unsolve/:id", this.unsolve );
        this.router.delete( "/member/:id&:team", this.deleteMemberNotes );
    }



    public getMemberNotes(req: Request, res: Response, next: NextFunction) {
        const id    = req.params.id;
        const team  = req.params.team;
        const batch = req.params.batch || "0" ;
        const limit = req.params.limit || "15";

        if ( ! id || ! team ) {
            return res.status( 422 ).json( { success: false, message: "Please provide a member id and a team id to get the member's notes." } );
        }

        Note.find( { member: id, team } )
            .sort( { date: -1 } )
            .skip( parseInt( batch ) * parseInt( limit ) )
            .limit( parseInt( limit ) )
            .then( notes => res.status( 200 ).json( { success: true, notes } ) )
            .catch( next );
    }



    public getSolved(req: Request, res: Response, next: NextFunction) {
        const userId = req.app.get( "user" )._id;

        Note.find( { owner: userId, isImpediment: true, isSolved: true } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }



    public getUnsolved(req: Request, res: Response, next: NextFunction) {
        const userId = req.app.get( "user" )._id;

        Note.find( { owner: userId, isImpediment: true, isSolved: false } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }



    public createNote(req: Request, res: Response, next: NextFunction) {
        const userId                                    = req.app.get( "user" )._id;
        const { member, team, content, isImpediment }   = req.body;

        const note = new Note({
            owner: userId,
            member,
            team,
            content,
            isImpediment
        });

        note.save()
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }



    public solve(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        Note.findByIdAndUpdate( id, { isSolved: true }, { "new" : true } )
            .populate( "member", "name _id" )
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }



    public unsolve(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        Note.findByIdAndUpdate( id, { isSolved: false }, { "new" : true } )
            .populate( "member", "name _id" )
            .then( note => res.status( 200 ).json( { success: true, note } ) )
            .catch( next );
    }



    public deleteMemberNotes(req: Request, res: Response, next: NextFunction) {
        const { id, team } = req.params;

        Note.deleteMany( { member: id, team: team } )
            .then( () => res.status( 200 ).json( { success: true, message: "Notes deleted." } ) )
            .catch( next );
    }

}



export default new NoteController().router;
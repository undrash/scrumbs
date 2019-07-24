

import RequireAuthentication from "../middlewares/RequireAuthentication";
import { Router, Request, Response, NextFunction } from "express";
import Note from "../models/Note";





class NoteController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/member/:id&:team&:batch&:limit", RequireAuthentication, this.getMemberNotes );
        this.router.get( "/solved", RequireAuthentication, this.getSolved );
        this.router.get( "/solved/:id", RequireAuthentication, this.getSolvedOfMember );
        this.router.get( "/unsolved", RequireAuthentication, this.getUnsolved );
        this.router.get( "/unsolved/:id", RequireAuthentication, this.getUnsolvedOfMember );
        this.router.post( '/', RequireAuthentication, this.createNote );
        this.router.delete( "/:id", RequireAuthentication, this.deleteNote );
        this.router.put( "/solve/:id", RequireAuthentication, this.solve );
        this.router.put( "/unsolve/:id", RequireAuthentication, this.unsolve );
        this.router.delete( "/member/:id&:team", RequireAuthentication, this.deleteMemberNotes );
        this.router.put( "/convert", RequireAuthentication, this.convert );
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
        const userId = ( req as any ).user._id;

        Note.find( { owner: userId, isImpediment: true, isSolved: true } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }



    public getSolvedOfMember(req: Request, res: Response, next: NextFunction) {
        const userId = ( req as any ).user._id;

        const memberId = req.params.id;

        Note.find( { owner: userId, member: memberId, isImpediment: true, isSolved: true } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }


    public getUnsolved(req: Request, res: Response, next: NextFunction) {
        const userId = ( req as any ).user._id;

        Note.find( { owner: userId, isImpediment: true, isSolved: false } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }



    public getUnsolvedOfMember(req: Request, res: Response, next: NextFunction) {
        const userId = ( req as any ).user._id;

        const memberId = req.params.id;

        Note.find( { owner: userId, member: memberId, isImpediment: true, isSolved: false } )
            .populate( "member", "name _id" )
            .then( impediments => res.status( 200 ).json( { success: true, impediments } ) )
            .catch( next );
    }



    public createNote(req: Request, res: Response, next: NextFunction) {
        const userId                                    = ( req as any ).user._id;
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



    public deleteNote(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;

        if ( ! id ) {
            return res.status( 422 ).json({
                success: false,
                message: "Invalid note id provided"
            });
        }

        Note.findByIdAndDelete( id )
            .then( () => res.status( 200 ).json( {
                success: true,
                message: "Note successfully deleted."
            }))
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



    public convert(req: Request, res: Response, next: NextFunction) {

        const { id, isImpediment } = req.body;

        Note.findByIdAndUpdate( id, { isImpediment } )
            .then( () => res.status( 200 ).json({
                success: true,
                message: `${ isImpediment ? "Impediment" : "Note" } successfully converted to ${ isImpediment ? "Note." : "Impediment." }`
            }))
            .catch( next )
    }

}



export default new NoteController().router;

import { Router, Request, Response, NextFunction } from "express";

import RequireAuthentication from "../middlewares/RequireAuthentication";
import Member from "../models/Member";
import Team from "../models/Team";
import Note from "../models/Note";





class TeamController {

    router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/', RequireAuthentication, this.getTeams );
        this.router.put( "/members/add", RequireAuthentication, this.addMembers );
        this.router.post( '/', RequireAuthentication, this.createTeam );
        this.router.put( '/', RequireAuthentication, this.updateTeam );
        this.router.delete( "/:id", RequireAuthentication, this.deleteTeam );
    }



    public getTeams(req: Request, res: Response, next: NextFunction) {
        const userId = ( req as any ).user._id;

        Team.find( { owner: userId } )
            .then( teams => {
                res.status( 200 ).json( { success: true, teams } );
            })
            .catch( next );
    }



    public addMembers = async (req: Request, res: Response, next: NextFunction) => {
        const { id, members } = req.body;

        await Member.updateMany({ _id: { $in: members } },
            {  $addToSet: { teams: id } }
            )
            .catch( next );

        Member.find({ _id: { $in: members } } )
            .then( members => res.status( 200 ).json({
                success: true,
                message: "Members successfully added to the team",
                members
            }))
            .catch( next );
    };



    public createTeam = async (req: Request, res: Response, next: NextFunction) => {
        const userId = ( req as any ).user._id;

        const { name, members } = req.body;

        if ( ! name ) {
            res.status( 422 ).json( { success: false, message: "Name property is required at team creation." } );
            return;
        }

        const team = new Team({
            name,
            owner: userId
        });

        await team.save();

        Member.updateMany(
            { _id: { $in: members } },
            {  $addToSet: { teams: team._id } },
            { multi: true }
        )
            .then( members => res.status( 200 ).json( { success: true, team, members } ) )
            .catch( next );

    };



    public updateTeam = async (req: Request, res: Response, next: NextFunction) => {
        const { id, name, members } = req.body;

        if ( ! id || ! name ) {
            res.status( 422 ).json( { success: false, message: "Invalid arguments provided for team update." } );
            return;
        }

        let addedMembers: string[]      = [];
        let removedMembers: string[]    = [];

        if ( members ) {
            const currentMembers    = await Member.find( { teams: id } );
            const currentMemberIds  = currentMembers.map( m => (m as any)._id.toString() );

            addedMembers            = members.filter( (m: any) => currentMemberIds.indexOf( m ) === -1 );
            removedMembers          = currentMemberIds.filter( (m: any) => members.indexOf( m ) === -1 );


            await Promise.all([
                Member.updateMany(
                    { _id: { $in: addedMembers } },
                    {  $addToSet: { teams: id } },
                    { multi: true } ),

                Member.updateMany(
                    { _id: { $in: removedMembers } },
                    {  $pull: { teams: id } },
                    { multi: true } )
            ]);
        }

        const team = await Team.findByIdAndUpdate( id, { name }, { "new" : true } );

        Member.find( { _id: { $in: addedMembers } } )
            .then( added => res.status( 200 ).json( { success: true, team, members: { added, removed: removedMembers } } ) )
            .catch( next );
    };



    public deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;

        await Member.updateMany(
            { teams: id },
            { $pull: { teams: id } },
            { multi: true }
        )
            .catch( next );


        await Note.deleteMany( { team: id } )
            .catch( next );


        Team.findByIdAndDelete( id )
            .then( () => res.status( 200 ).json( {
                success: true,
                message: "Team deleted with all related members, notes, and impediments."
            }))
            .catch( next );
    };



}



export default new TeamController().router;
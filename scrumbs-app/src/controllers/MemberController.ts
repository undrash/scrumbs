

import RequireAuthentication from "../middlewares/RequireAuthentication";
import { Router, Request, Response, NextFunction } from "express";
import Member from "../models/Member";
import Note from "../models/Note";




class MemberController {

    router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }


    public routes() {
        this.router.get( '/', RequireAuthentication, this.getMembers );
        this.router.get( "/search/:string", RequireAuthentication, this.searchMembers );
        this.router.post( '/', RequireAuthentication, this.createMember );
        this.router.get( "/:team", RequireAuthentication, this.getMembersOfTeam );
        this.router.put( "/add", RequireAuthentication, this.addMemberToTeam );
        this.router.put( "/remove", RequireAuthentication, this.removeMemberFromTeam );
        this.router.put( "/edit", RequireAuthentication, this.editMember );
        this.router.delete( "/:id", RequireAuthentication, this.deleteMember );
    }



    public getMembers(req: Request, res: Response, next: NextFunction) {
        const userId = ( req as any ).user._id;

        Member.find( { owner: userId } )
            .populate( "teams", "name isDefault _id" )
            .then( members => res.status( 200 ).json( { success: true, members } ) )
            .catch( next );
    }



    public searchMembers(req: Request, res: Response, next: NextFunction) {
        const userId = ( req as any ).user._id;
        const string = req.params.string || "";

        Member.find( { owner: userId, name: { $regex: string, $options: 'i' } } )
            .populate( "teams", "name isDefault _id" )
            .then( members => res.status( 200 ).json( { success: true, members } ) )
            .catch( next );
    }



    public createMember(req: Request, res: Response, next: NextFunction) {
        const userId            = ( req as any ).user._id;
        const { name, team }    = req.body;

        if ( ! name ) {
            res.status( 422 ).json( { success: false, message: "Name property is required at member creation." } );
            return;
        }

        if ( ! team ) {
            res.status( 422 ).json( { success: false, message: "Team property is required at member creation." } );
            return;
        }

        const member = new Member({
            name,
            owner: userId
        });

        member.teams.push( team );

        member.save()
            .then( member => res.status( 200 ).json( { success: true, member } ) )
            .catch( next );
    }



    public getMembersOfTeam(req: Request, res: Response, next: NextFunction) {
        const userId = ( req as any ).user._id;
        const teamId = req.params.team;

        Member.find( { owner: userId, teams: teamId } )
            .then( members => res.status( 200 ).json( { success: true, members } ) )
            .catch( next );
    }



    public addMemberToTeam(req: Request, res: Response, next: NextFunction) {
        const { member, team } = req.body;

        if ( ! member ) {
            res.status( 422 ).json( { success: false, message: "Member id is required to perform this operation." } );
            return;
        }

        if ( ! team ) {
            res.status( 422 ).json( { success: false, message: "Team id is required to perform this operation." } );
            return;
        }

        Member.findByIdAndUpdate( member,
            { $push: { teams: team } },
            { "new": true } )
            .then( member => res.status( 200 ).json( { success: true, member } ) )
            .catch( next );
    }



    public removeMemberFromTeam = async (req: Request, res: Response, next: NextFunction) => {
        const { member, team } = req.body;

        if ( ! member ) {
            res.status( 422 ).json( { success: false, message: "Member id is required to perform this operation." } );
            return;
        }

        if ( ! team ) {
            res.status( 422 ).json( { success: false, message: "Team id is required to perform this operation." } );
            return;
        }

        await Note.deleteMany( { member, team } )
            .catch( next );

        Member.findByIdAndUpdate( member,
            { $pull: { teams: team } },
            { "new": true } )
            .then( member => res.status( 200 ).json( { success: true, member } ) )
            .catch( next );
    };



    public editMember(req: Request, res: Response, next: NextFunction) {
        const { member, name } = req.body;

        Member.findByIdAndUpdate( member, { name }, { "new": true } )
            .select("name" )
            .then( member => res.status( 200 ).json( { success: true, member } ) );
    }



    public deleteMember(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;

        if ( ! id ) {
            return res.status( 422 ).json({
                success: false,
                message: "Invalid member id provided"
            });
        }

        Member.findByIdAndDelete( id )
            .then( () => {
                return Note.deleteMany( { member: id } ) as any;
            })
            .then( () => res.status( 200 ).json( {
                success: true,
                message: "Member deleted with all their associated notes."
            }))
            .catch( next );
    }

}



export default new MemberController().router;
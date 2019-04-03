
import {IAddRemoveMemberModel} from "./models/interfaces/IAddRemoveMemberModel";
import {ICreateMemberModel} from "./models/interfaces/ICreateMemberModel";
import {ICreateNoteModel} from "./models/interfaces/ICreateNoteModel";
import {ICreateTeamModel} from "./models/interfaces/ICreateTeamModel";
import {IUpdateTeamModel} from "./models/interfaces/IUpdateTeamModel";
import {IEditMemberModel} from "./models/interfaces/IEditMemberModel";
import {ILoginModel} from "./models/interfaces/ILoginModel";
import {Proxy} from "../core/Proxy";
import {UserVO} from "./UserVO";


declare const SERVICE_URL: string;






export class ConnectionProxy extends Proxy {

    constructor(proxyName: string) {
        super( proxyName, SERVICE_URL );
    }



    public login(data: ILoginModel, success: Function, failure: Function): void {

        this.httpRequest(
            "POST",
            "/api/v1/authentication/login",
            data,
            (response: any ) => {

                this.setToken( response.tokenData );

                const {  name, email } = response.userData;

                ConnectionProxy.setVO( new UserVO(
                    name,
                    email
                ));

                success( response );
            },
            failure
        );
    }



    public signUp(data: ILoginModel, success: Function, failure: Function): void {

        this.httpRequest(
            "POST",
            "/api/v1/authentication/sign-up",
            data,
            (response: any) => {

                this.setToken( response.tokenData );

                const {  name, email } = response.userData;

                ConnectionProxy.setVO( new UserVO(
                    name,
                    email
                ));

                success( response );
            },
            failure
        );
    }



    public getTeams(success: Function, failure: Function): void {

        this.httpRequest(
            "GET",
            "/api/v1/teams",
            null,
            success,
            failure
        );
    }



    public createTeam(data: ICreateTeamModel, success: Function, failure: Function): void {

        this.httpRequest(
            "POST",
            "/api/v1/teams",
            data,
            success,
            failure
        );
    }


    
    public updateTeam(data: IUpdateTeamModel, success: Function, failure: Function): void {

        this.httpRequest(
            "PUT",
            "/api/v1/teams",
            data,
            success,
            failure
        );
    }



    public getMembers(success: Function, failure: Function): void {

        this.httpRequest(
            "GET",
            "/api/v1/members",
            null,
            success,
            failure
        );
    }



    public createMember(data: ICreateMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            "POST",
            "/api/v1/members",
            data,
            success,
            failure
        );
    }



    public editMember(data: IEditMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            "PUT",
            "/api/v1/members/edit",
            data,
            success,
            failure
        );
    }



    public deleteMember(memberId: string, success: Function, failure: Function): void {

        this.httpRequest(
            "DELETE",
            `/api/v1/members/${ memberId }`,
            null,
            success,
            failure
        );
    }



    public getMembersOfTeam(teamId: string, success: Function, failure: Function): void {

        this.httpRequest(
            "GET",
            `/api/v1/members/${ teamId }`,
            null,
            success,
            failure
        );
    }



    public addMemberToTeam(data: IAddRemoveMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            "PUT",
            "api/v1/members/add",
            data,
            success,
            failure
        )
    }



    public removeMemberFromTeam(data: IAddRemoveMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            "PUT",
            "api/v1/members/remove",
            data,
            success,
            failure
        )
    }



    public getNotesOfMember(memberId: string, teamId: string, batch: number = 0, limit: number = 15, success: Function, failure: Function): void {

        this.httpRequest(
            "GET",
            `/api/v1/notes/member/${ memberId }&${ teamId }&${ batch }&${ limit }`,
            null,
            success,
            failure
        );
    }



    public deleteNotesOfMember(memberId: string, teamId: string, success: Function, failure: Function): void {

        this.httpRequest(
            "DELETE",
            `/api/v1/notes/member/${ memberId }&${ teamId }`,
            null,
            success,
            failure
        );
    }



    public createNote(data: ICreateNoteModel, success: Function, failure: Function): void {

        console.log( data );

        this.httpRequest(
            "POST",
            "/api/v1/notes/",
            data,
            success,
            failure
        )
    }



    public getSolvedImpediments(success: Function, failure: Function): void {

        this.httpRequest(
            "GET",
            "/api/v1/notes/solved",
            null,
                success,
                failure
        );
    }



    public getUnsolvedImpediments(success: Function, failure: Function): void {

        this.httpRequest(
            "GET",
            "/api/v1/notes/unsolved",
            null,
            success,
            failure
        );
    }



    public solveImpediment(impedimentId: string, success: Function, failure: Function): void {

        this.httpRequest(
            "PUT",
            `/api/v1/notes/solve/${ impedimentId }`,
            null,
            success,
            failure
        );
    }



    public unsolveImpediment(impedimentId: string, success: Function, failure: Function): void {

        this.httpRequest(
            "PUT",
            `/api/v1/notes/unsolve/${ impedimentId }`,
            null,
            success,
            failure
        );
    }

}
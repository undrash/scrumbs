
import {IAddRemoveMemberModel} from "./models/interfaces/IAddRemoveMemberModel";
import {ICreateInquiryModel} from "./models/interfaces/ICreateInquiryModel";
import {ICreateMemberModel} from "./models/interfaces/ICreateMemberModel";
import {ICreateNoteModel} from "./models/interfaces/ICreateNoteModel";
import {ICreateTeamModel} from "./models/interfaces/ICreateTeamModel";
import {IUpdateTeamModel} from "./models/interfaces/IUpdateTeamModel";
import {IEditMemberModel} from "./models/interfaces/IEditMemberModel";
import {IEditNoteModel} from "./models/interfaces/IEditNoteModel";
import {ISignUpModel} from "./models/interfaces/ISignUpModel";
import {ILoginModel} from "./models/interfaces/ILoginModel";
import {HTTPMethods} from "../core/HTTPMethods";
import {Proxy} from "../core/Proxy";
import {UserVO} from "./UserVO";



declare const DATA_SOURCE: any;





export class ConnectionProxy extends Proxy {
    public static EXTERNAL_AUTH: boolean = false;

    constructor(proxyName: string) {
        let address = `${ location.protocol }//${ location.hostname }${ location.port ? ':' + location.port: '' }`;
        super( proxyName, address );
        this.initialize();
    }



    private initialize(): void {

        if ( ConnectionProxy.token || typeof DATA_SOURCE === "undefined" ) return;

        const data      = DATA_SOURCE;
        const dataSrc   = document.getElementById( "data-source" );

        if ( dataSrc ) dataSrc.parentNode.removeChild( dataSrc );

        const {  name, email, onboardingGuidesDisplayed } = data.userData;

        ConnectionProxy.setVO( new UserVO(
            name,
            email,
            onboardingGuidesDisplayed
        ));

        console.log( "EXTERNAL ACCESS: ", data );

        ConnectionProxy.EXTERNAL_AUTH = true;
    }


    public login(data: ILoginModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.POST,
            "/api/v1/authentication/login",
            data,
            (response: any ) => {

                // this.setToken( response.tokenData );

                const {  name, email, onboardingGuidesDisplayed } = response.userData;

                ConnectionProxy.setVO( new UserVO(
                    name,
                    email,
                    onboardingGuidesDisplayed
                ));

                success( response );
            },
            failure
        );
    }



    public signUp(data: ISignUpModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.POST,
            "/api/v1/authentication/sign-up",
            data,
            (response: any) => {

                // this.setToken( response.tokenData );

                const {  name, email, onboardingGuidesDisplayed } = response.userData;

                ConnectionProxy.setVO( new UserVO(
                    name,
                    email,
                    onboardingGuidesDisplayed
                ));

                success( response );
            },
            failure
        );
    }



    public getTeams(success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            "/api/v1/teams",
            null,
            success,
            failure
        );
    }



    public createTeam(data: ICreateTeamModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.POST,
            "/api/v1/teams",
            data,
            success,
            failure
        );
    }


    
    public updateTeam(data: IUpdateTeamModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            "/api/v1/teams",
            data,
            success,
            failure
        );
    }



    public deleteTeam(teamId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.DELETE,
            `/api/v1/teams/${ teamId }`,
            null,
            success,
            failure
        );
    }



    public getMembers(success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            "/api/v1/members",
            null,
            success,
            failure
        );
    }



    public searchMembers(string: string,success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            `/api/v1/members/search/${ string }`,
            null,
            success,
            failure
        );
    }



    public createMember(data: ICreateMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.POST,
            "/api/v1/members",
            data,
            success,
            failure
        );
    }



    public editMember(data: IEditMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            "/api/v1/members/edit",
            data,
            success,
            failure
        );
    }



    public deleteMember(memberId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.DELETE,
            `/api/v1/members/${ memberId }`,
            null,
            success,
            failure
        );
    }



    public getMembersOfTeam(teamId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            `/api/v1/members/${ teamId }`,
            null,
            success,
            failure
        );
    }



    public addMemberToTeam(data: IAddRemoveMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            "api/v1/members/add",
            data,
            success,
            failure
        )
    }



    public removeMemberFromTeam(data: IAddRemoveMemberModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            "/api/v1/members/remove",
            data,
            success,
            failure
        )
    }



    public getNotesOfMember(memberId: string, teamId: string, batch: number = 0, limit: number = 15, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            `/api/v1/notes/member/${ memberId }&${ teamId }&${ batch }&${ limit }`,
            null,
            success,
            failure
        );
    }



    public deleteNotesOfMember(memberId: string, teamId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.DELETE,
            `/api/v1/notes/member/${ memberId }&${ teamId }`,
            null,
            success,
            failure
        );
    }



    public createNote(data: ICreateNoteModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.POST,
            "/api/v1/notes/",
            data,
            success,
            failure
        );
    }



    public editNote(data: IEditNoteModel, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            "/api/v1/notes/",
            data,
            success,
            failure
        );
    }



    public convertNote(id: string, isImpediment: boolean, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            "/api/v1/notes/convert",
            { id, isImpediment },
            success,
            failure
        );
    }



    public deleteNote(id: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.DELETE,
            `/api/v1/notes/${ id }`,
            null,
                success,
                failure
        );
    }



    public getSolvedImpediments(success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            "/api/v1/notes/solved",
            null,
                success,
                failure
        );
    }



    public getSolvedImpedimentsOfMember(memberId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            `/api/v1/notes/solved/${ memberId }`,
            null,
            success,
            failure
        );
    }



    public getUnsolvedImpediments(success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            "/api/v1/notes/unsolved",
            null,
            success,
            failure
        );
    }



    public getUnsolvedImpedimentsOfMember(memberId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.GET,
            `/api/v1/notes/unsolved/${ memberId }`,
            null,
            success,
            failure
        );
    }



    public solveImpediment(impedimentId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            `/api/v1/notes/solve/${ impedimentId }`,
            null,
            success,
            failure
        );
    }



    public unsolveImpediment(impedimentId: string, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.PUT,
            `/api/v1/notes/unsolve/${ impedimentId }`,
            null,
            success,
            failure
        );
    }



    public createInquiry(data: ICreateInquiryModel, success: Function, failure: Function): void {


        this.httpRequest(
            HTTPMethods.POST,
            "/api/v1/inquiries",
            data,
            success,
            failure
        );
    }



    public onboardingGuideDisplayed(guideId: number, success: Function, failure: Function): void {

        this.httpRequest(
            HTTPMethods.POST,
            `/api/v1/users/onboarding/${ guideId }`,
            null,
            success,
            failure
        );
    }

}
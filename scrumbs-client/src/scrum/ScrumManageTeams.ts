
import {CreateMemberModel} from "../connection/models/CreateMemberModel";
import {UpdateTeamModel} from "../connection/models/UpdateTeamModel";
import {ViewEnterTypes} from "../core/ViewEnterTypes";
import {ViewComponent} from "../core/ViewComponent";
import {ViewExitTypes} from "../core/ViewExitTypes";
import {ScrumSignals} from "./ScrumSignals";
import {View} from "../core/View";

import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;



// CSS
import "../_style/style-sheets/scrum-manage-teams.scss";


// HTML
const template = require( "../_view-templates/scrum/component/scrum-manage-teams.html" );






export class ScrumManageTeams extends ViewComponent {
    private saveBtn: HTMLButtonElement;
    private cancelBtn: HTMLButtonElement;
    private exitBtn: HTMLSpanElement;

    private teamNameInput: HTMLInputElement;
    private deleteTeamBtn: HTMLButtonElement;

    private addMemberBtn: HTMLElement;
    private memberContainer: HTMLUListElement;

    private addTeamBtn: HTMLElement;
    private teamContainer: HTMLUListElement;

    private localPrefix: string;

    private loadedTeamId: string;

    constructor(view: View, container: HTMLElement) {
        super( view, container );

        this.localPrefix = "manage-teams-";

        this.container.innerHTML = template;

        this.saveBtn            = document.getElementById( "manage-teams-save-button" ) as HTMLButtonElement;
        this.cancelBtn          = document.getElementById( "manage-teams-cancel-button" ) as HTMLButtonElement;
        this.exitBtn            = document.getElementById( "manage-teams-exit-button" ) as HTMLSpanElement;

        this.teamNameInput      = document.getElementById( "manage-teams-input-edit-team-name" ) as HTMLInputElement;
        this.deleteTeamBtn      = document.getElementById( "manage-teams-delete-team-button" ) as HTMLButtonElement;

        this.addMemberBtn       = document.getElementById( "manage-teams-add-member-button" ) as HTMLElement;
        this.memberContainer    = document.getElementById( "manage-teams-member-container" ) as HTMLUListElement;

        this.addTeamBtn         = document.getElementById( "manage-teams-add-team-button" ) as HTMLElement;
        this.teamContainer      = document.getElementById( "manage-teams-team-container" ) as HTMLUListElement;


        this.exitBtnHandler         = this.exitBtnHandler.bind( this );
        this.cancelBtnHandler       = this.cancelBtnHandler.bind( this );
        this.saveBtnHandler         = this.saveBtnHandler.bind( this );
        this.addMemberBtnHandler    = this.addMemberBtnHandler.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.exitBtn.addEventListener( "click", this.exitBtnHandler );
        this.cancelBtn.addEventListener( "click", this.exitBtnHandler );
        this.saveBtn.addEventListener( "click", this.saveBtnHandler );
        this.addMemberBtn.addEventListener( "click", this.addMemberBtnHandler );
    }



    private unregisterEventListeners(): void {
        this.exitBtn.removeEventListener( "click", this.exitBtnHandler );
        this.cancelBtn.removeEventListener( "click", this.exitBtnHandler );
        this.saveBtn.removeEventListener( "click", this.saveBtnHandler );
        this.addMemberBtn.removeEventListener( "click", this.addMemberBtnHandler );
    }



    private exitBtnHandler(e: any) {
        this.exitScene( ViewExitTypes.HIDE_COMPONENT );
    }



    private populateTeams(resolve: Function): void {

        this.connection.getTeams(
            (response: any) => {
                console.log( response );

                const { teams } = response;

                for ( let team of teams ) {
                    this.addTeam( team );
                }

                resolve();

            },
            (err: string) => console.error( err )
        );
    }



    private addTeam(teamData: any, prepend?: boolean) {

        console.info( "addteam called ", teamData );

        let team        = document.createElement( "li" );
        team.id         = `${ this.localPrefix }${ teamData._id }`;
        team.className  = "manage-teams-team noselect pointer";
        team.innerText  = teamData.name;

        if ( prepend ) {
            this.teamContainer.insertBefore( team, this.teamContainer.firstChild );
        } else {
            this.teamContainer.appendChild( team );
        }

        team.addEventListener( "click", () => this.selectTeam( team ) );
    }



    private selectTeam(team: HTMLElement): void {
        const teamElements = document.getElementsByClassName( "manage-teams-team" );

        for ( let i = 0; i < teamElements.length; i++ ) {
            teamElements[i].classList.remove( "active" );
        }

        team.classList.add( "active" );

        this.loadTeamData( team.id );
    }



    private populateMembers(resolve: Function): void {

        this.connection.getMembers(
            (response: any) => {
                console.log( response );
                const { members } = response;

                for ( let member of members ) {
                    this.addMember( member );
                }

                resolve();
            },
            (err: string) => console.error( err )
        )
    }



    private addMember(memberData: any, active?: boolean): void {
        let member          = document.createElement( "li" );
        member.innerHTML    = memberData.name;
        member.id           = `${ this.localPrefix }${ memberData._id }`;

        if ( active ) member.classList.add( "active" );

        let checkbox        = document.createElement( "span" );
        checkbox.className  = "create-team-member-checkbox";

        member.appendChild( checkbox );

        this.memberContainer.insertBefore( member, this.memberContainer.firstChild );

        member.addEventListener( "click", () => member.classList.toggle( "active" ) );
    }



    private loadTeamData(id?: string): void {

        let team: Element;
        let teamId: string;

        if ( ! id ) {
            /** If there is no id specified, we default to the first team in the list */
            team = this.teamContainer.firstElementChild;
            team.classList.add( "active" );
        } else {
            /** If we got the team id as an argument, we isolate the element and extract the id later  */
            team = document.getElementById( id );
        }

        /** If there is no valid team, we return */
        if ( ! team ) return;

        /** Parse the real id, without the local prefix */
        teamId = team.id.replace( this.localPrefix, "" );

        /** We save the currently loaded team Id (will be used for further operations, e.g. updating the team on save) */
        this.loadedTeamId = teamId;

        /** Set the input value as the name of the team selected */
        this.teamNameInput.value = team.innerHTML;

        /** Remove the active member mark from the previous team */
        this.clearActiveMembers();

        /** Get the members of the team and mark them as active members of the team */
        this.connection.getMembersOfTeam(
            teamId,
            (response: any) => {
                console.log( response );

                const { members } = response;

                for ( let member of members ) {
                    document.getElementById( `${ this.localPrefix }${ member._id }` ).classList.add( "active" );
                }
            },
            (err: string) => console.error( err )
        );
    }



    private clearActiveMembers(): void {
        const members = this.memberContainer.children;

        for ( let i = 0; i < members.length; i++ ) {
            members[i].classList.remove( "active" );
        }
    }



    private getActiveMemberIds(): string[] {
        const members = this.memberContainer.children;
        let memberIds  = [];

        for ( let i = 0; i < members.length; i++ ) {
            if ( members[i].classList.contains( "active" ) ) {
                memberIds.push( members[i].id.replace( this.localPrefix, "" ) );
            }
        }

        return memberIds;
    }



    private resetView(): void {
        this.teamNameInput.value        = null;
        this.teamContainer.innerHTML    = null;
        this.memberContainer.innerHTML  = null;
    }



    private cancelBtnHandler(e: any) {
        this.exitScene( ViewExitTypes.HIDE_COMPONENT );
    }



    private saveBtnHandler(e: any) {
        const id        = this.loadedTeamId;
        const name      = this.teamNameInput.value;
        const members   = this.getActiveMemberIds();


        if ( ! name ) {
            console.error( "Team name is required when updating a team." );
            return;
        }

        if ( ! id ) {
            console.error( "Team id is required when updating a team." );
            return;
        }

        const updateTeamModel = new UpdateTeamModel( id, name, members );

        this.connection.updateTeam(
            updateTeamModel,
            (response: any) => {
                this.sendSignal( ScrumSignals.TEAM_UPDATED, response );
            },
            (err: string) => console.error( err )
        );
    }



    private addMemberBtnHandler(e: any) {
        /** If the input is already in place, we return */
        if ( this.memberContainer.firstElementChild.tagName === "INPUT" ) return;

        const input = document.createElement( "input" );
        input.placeholder = "Enter member name";

        this.memberContainer.insertBefore( input, this.memberContainer.firstChild );

        input.addEventListener( "blur", () => {
            if ( ! input.value ) {
                input.parentNode.removeChild( input );
                return;
            }

            input.readOnly = true;

            const name = input.value;
            const team = this.loadedTeamId;

            const createMemberModel = new CreateMemberModel( name, team );


            this.connection.createMember(
                createMemberModel,
                (response: any) => {
                    const { member } = response;

                    this.addMember( member, true );
                    input.parentNode.removeChild( input );
                    this.sendSignal( ScrumSignals.MEMBER_ADDED, { member, team } );
                },
                (err: string) => console.error( err )
            );

        });

        input.addEventListener( "keydown", (e: any) => {
            const key = e.which || e.keyCode;

            if ( key === 27 ) { // ESC
                input.value = null;
                input.blur();
            } else if ( key === 13 ) { // ENTER
                input.blur();
            }
        });

        input.focus();
    }



    public enterScene(enterType?: string) {
        console.info( "Enter being called in scrum manage teams view component" );

        switch ( enterType ) {

            case ViewEnterTypes.REVEAL_COMPONENT :

                this.container.style.display = "block";


                Promise.all([
                    new Promise<void>( (resolve, reject) => this.populateTeams( resolve ) ),
                    new Promise<void>( (resolve, reject) => this.populateMembers( resolve ) )
                ])
                    .then( () => this.loadTeamData() )
                    .catch( (err: string) => console.error( err ) );

                break;


            default :
                this.registerEventListeners();
                break;
        }
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum manage teams view component" );

        switch ( exitType ) {

            case ViewExitTypes.HIDE_COMPONENT :

                this.container.style.display = "none";
                this.resetView();

                break;

            default :
                super.exitScene( exitType );
                this.unregisterEventListeners();
                this.view.componentExited( this.name );
                break;
        }
    }
}

import {CreateMemberModel} from "../../../connection/models/CreateMemberModel";
import {UpdateTeamModel} from "../../../connection/models/UpdateTeamModel";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";

import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;

declare const SimpleBar: any;



// HTML
const template = require( "../../../templates/manage-teams.html" );






export class ManageTeams extends ViewComponent {


    private teamNameInput: HTMLInputElement;
    private deleteTeamBtn: HTMLElement;

    private addMemberBtn: HTMLElement;
    private mainMemberContainer: HTMLElement;
    private memberContainer: HTMLElement;

    private mainTeamContainer: HTMLElement;
    private teamContainer: HTMLElement;

    private createTeamBtn: HTMLElement;

    private localPrefix: string;

    private loadedTeamId: string;

    constructor(view: View, container: HTMLElement) {
        super( view, container, "ManageTeams" );

        this.localPrefix            = "manage-teams-";

        this.container.innerHTML    = template;


        this.teamNameInput          = document.getElementById( "manage-teams-input-edit-team-name" ) as HTMLInputElement;
        this.deleteTeamBtn          = document.getElementById( "manage-teams-delete-team-button" );

        this.addMemberBtn           = document.getElementById( "manage-teams-add-member-button" );
        this.mainMemberContainer    = document.getElementById( "team-members-list-container" );

        new SimpleBar( this.mainMemberContainer );

        this.memberContainer        = this.mainMemberContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLElement;

        this.mainTeamContainer      = document.getElementById( "teams-list-container" );

        new SimpleBar( this.mainTeamContainer );

        this.teamContainer          = this.mainTeamContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLElement;

        this.createTeamBtn          = document.getElementById( "manage-members-add-new-member-btn" );



        this.enterScene();
    }



    private registerEventListeners(): void {


    }



    private unregisterEventListeners(): void {

    }



    private populateTeams(resolve: Function): void {

        this.teamContainer.innerHTML = '';

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

        let team        = document.createElement( "div" );
        team.id         = `${ this.localPrefix }${ teamData._id }`;
        team.className  = "teams-list-item";
        team.innerText  = teamData.name;

        if ( prepend ) {
            this.teamContainer.insertBefore( team, this.teamContainer.firstChild );
        } else {
            this.teamContainer.appendChild( team );
        }

        team.addEventListener( "click", () => this.selectTeam( team ) );
    }



    private selectTeam(team: HTMLElement): void {
        const teamElements = document.getElementsByClassName( "teams-list-item" );

        for ( let i = 0; i < teamElements.length; i++ ) {
            teamElements[i].classList.remove( "active" );
        }

        team.classList.add( "active" );

        // this.loadTeamData( team.id );
    }



    private populateMembers(teamId: string): void {

        this.memberContainer.innerHTML = '';

        /** Get the members of the team and mark them as active members of the team */
        this.connection.getMembersOfTeam(
            teamId,
            (response: any) => {
                const { members } = response;

                for ( let member of members ) {
                    this.addMember( member );
                }
            },
            (err: string) => console.error( err )
        );
    }



    private addMember(memberData: any): void {
        let member          = document.createElement( "div" );
        member.innerText    = memberData.name;
        member.id           = `${ this.localPrefix }${ memberData._id }`;
        member.className    = "team-members-list-item";

        let removeBtn        = document.createElement( "div" );
        removeBtn.className  = "remove-member-btn";

        member.appendChild( removeBtn );

        this.memberContainer.insertBefore( member, this.memberContainer.firstChild );
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


        this.populateMembers( teamId );
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
                // this.sendSignal( ScrumSignals.TEAM_UPDATED, response );
            },
            (err: string) => console.error( err )
        );
    }



    private addMemberBtnHandler(e: any) {

    }



    public enterScene(enterType?: string) {
        console.info( "Enter being called in scrum manage teams view component" );
        this.registerEventListeners();

        Promise.all([
            new Promise<void>( (resolve, reject) => this.populateTeams( resolve ) ),
            // new Promise<void>( (resolve, reject) => this.populateMembers( resolve ) )
        ])
            .then( () => this.loadTeamData() )
            .catch( (err: string) => console.error( err ) );
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum manage teams view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }
}
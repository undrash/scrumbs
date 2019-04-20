

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ScrumSignals} from "./ScrumSignals";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;


declare const SimpleBar: any;

// CSS
import "../../../style/style-sheets/scrum-teams.scss";
import {CreateMemberModel} from "../../../connection/models/CreateMemberModel";


// HTML
const template = require( "../templates/scrum/component/scrum-teams.html" );






export class ScrumTeams extends ViewComponent {
    private createTeamBtn: HTMLButtonElement;
    private teamSettingsBtn: HTMLButtonElement;

    private title: HTMLHeadingElement;
    private teamsMainContainer: HTMLUListElement;

    private teamsContainer: HTMLDivElement;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "ScrumTeams" );

        this.container.innerHTML = template;

        this.title                  = document.getElementById( "scrum-teams-title" ) as HTMLHeadingElement;
        this.createTeamBtn          = document.getElementById( "scrum-create-team-btn" ) as HTMLButtonElement;
        this.teamSettingsBtn        = document.getElementById( "scrum-team-settings-btn" ) as HTMLButtonElement;
        this.teamsMainContainer     = document.getElementById( "scrum-teams-team-container" ) as HTMLUListElement;

        new SimpleBar( this.teamsMainContainer );

        this.teamsContainer         = this.teamsMainContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLDivElement;

        this.populate();

        this.createTeamBtnListener      = this.createTeamBtnListener.bind( this );
        this.teamSettingsButtonListener = this.teamSettingsButtonListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.createTeamBtn.addEventListener( "click", this.createTeamBtnListener );
        this.teamSettingsBtn.addEventListener( "click", this.teamSettingsButtonListener );
    }



    private unregisterEventListeners(): void {
        this.createTeamBtn.removeEventListener( "click", this.createTeamBtnListener );
        this.teamSettingsBtn.removeEventListener( "click", this.teamSettingsButtonListener );

    }



    private createTeamBtnListener(e: any) {
        this.sendSignal( ScrumSignals.CREATE_TEAM );
    }



    private teamSettingsButtonListener(e: any) {
        this.sendSignal( ScrumSignals.TEAM_SETTINGS );
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in scrum teams view component" );
        this.registerEventListeners();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum teams view view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }



    public populate(): void {
        this.connection.getTeams(
            (response: any ) => {
                console.log( response );

                const { teams } = response;

                this.populateTeams( teams );


                /** Check memory */

                const { selectedMember } = this.getMemory();

                console.log( "Selected member: ", selectedMember );

                /** If we have recollection of a selected member, we load it */
                if ( selectedMember ) {

                    this.connection.getMembersOfTeam(
                        selectedMember.team,
                        (response: any) => {
                            this.populateMembers( selectedMember.team, response.members );
                            this.sendSignal( ScrumSignals.LOAD_MEMBER_NOTES, selectedMember );
                            this.applySelectionToMember( `${ selectedMember.team }@${ selectedMember.id }` );

                        },
                        (err: any) => console.error( err )
                    );

                } else {
                /** If we don't have memory data, we load the default team */

                    let defaultTeamId: string;

                    for ( let team of teams ) {
                        if ( team.isDefault === true ) {
                            defaultTeamId = team._id;
                            break;
                        }
                    }

                    if ( ! defaultTeamId ) return;

                    this.connection.getMembersOfTeam(
                        defaultTeamId,
                        (response: any) => this.populateMembers( defaultTeamId, response.members ),
                        (err: any) => console.error( err )
                    );

                }

            },
            (err: string) => console.error( err )
        )
    }



    private populateTeams(teams: any[]): void {

        for ( let team of teams ) {

            this.addTeam( team );

        }
    }



    public addTeam(teamData: any): void {

        let teamContainer           = document.createElement( "li" );
        teamContainer.className     = "scrum-team";

        let header                  = document.createElement( "div" );
        header.className            = "scrum-team-header pointer";

        let title                   = document.createElement( "h2" );
        title.className             = "scrum-team-name bold noselect";
        title.innerHTML             = teamData.name;

        let button                  = document.createElement( "button" );
        button.className            = "scrum-create-member-btn";

        let membersContainer        = document.createElement( "ul" );
        membersContainer.id         = teamData._id;
        membersContainer.className  = "scrum-team-members";

        header.appendChild( title );
        header.appendChild( button );

        teamContainer.appendChild( header );
        teamContainer.appendChild( membersContainer );

        if ( teamData.isDefault ) {
            this.teamsContainer.insertBefore( teamContainer, this.teamsContainer.firstChild );
        } else {
            this.teamsContainer.appendChild( teamContainer );
        }

        this.addToggleListenerToHeader( header, teamContainer );
        this.addClickListenerToAddMemberBtn( button, membersContainer );
    }



    private populateMembers(teamId: string, members: any[]): void {

        for ( let i = members.length - 1; i >= 0; i-- ) {
            this.addMember( members[i], teamId );
        }

        document.getElementById( teamId ).parentElement.classList.add( "active" );
    }



    public addMember(memberData: any, teamId: string, prepend?: boolean): void {
        let member           = document.createElement( "li" );
        member.id            = `${ teamId }@${ memberData._id }`;
        member.className     = "scrum-team-member pointer noselect";
        member.innerHTML     = memberData.name;

        member.addEventListener( "click", () => {

            this.applySelectionToMember( member.id );

            this.sendSignal(
                ScrumSignals.LOAD_MEMBER_NOTES,
                {
                        id: memberData._id,
                        team: teamId,
                        name: member.innerText
                    }
            );

            this.updateMemory( { selectedMember: {
                id: memberData._id,
                team: teamId,
                name: member.innerText
            }});
        });

        const membersContainer = document.getElementById( teamId );

        if ( ! prepend ) {
            membersContainer.appendChild( member );
        } else {
            membersContainer.insertBefore( member, membersContainer.firstChild );
        }
    }



    public updateMember(memberId: string, name: string) {
        let memberElements = [];

        let teamContainers = document.getElementsByClassName( "scrum-team-members" );

        for ( let i = 0; i < teamContainers.length; i++ ) {
            const member = document.getElementById( `${ teamContainers[i].id }@${ memberId }` );

            if ( member ) memberElements.push( member );
        }

        for ( let i = 0; i < memberElements.length; i++ ) {
            memberElements[i].innerText = name;
        }
    }



    private applySelectionToMember(memberId: string): void {
        const members = document.getElementsByClassName( "scrum-team-member" );

        for ( let i = 0; i < members.length; i++ ) {
            members[i].classList.remove( "active" );
        }

        document.getElementById( memberId ).classList.add( "active" );
    }



    private createMember(name: string, team: string): void {
        if ( ! name ) return;

        console.log( name );

        const createMemberModel = new CreateMemberModel( name, team );

        this.connection.createMember(
            createMemberModel,
            (response: any) => {
                console.log( response );
                const { member }        = response;

                this.addMember( member, team, true );

            },
            (err: string) => console.error( err )
        )
    }



    private addToggleListenerToHeader(header: HTMLElement, teamContainer: HTMLElement): void {
        header.addEventListener( "click", (e: any) => {
            if ( e.target.classList.contains( "scrum-create-member-btn" ) ) return;

            if ( header.nextElementSibling.hasChildNodes() ) {

                teamContainer.classList.toggle( "active" );

            } else {

                this.connection.getMembersOfTeam(
                    header.nextElementSibling.id,
                    (response: any) => this.populateMembers( header.nextElementSibling.id, response.members ),
                    (err: string) => console.error( err )
                )
            }
        });
    }



    private addClickListenerToAddMemberBtn(button: HTMLButtonElement, membersContainer: HTMLElement): void {
        button.addEventListener( "click", (e: any) => {

            /** If the team is not loaded yet, populate and add the input */
            if ( ! membersContainer.hasChildNodes() ) {

                this.connection.getMembersOfTeam(
                    membersContainer.id,
                    (response: any) => {
                        this.populateMembers( membersContainer.id, response.members );
                        this.insertAddMemberInput( membersContainer );

                    },
                    (err: string) => console.error( err )
                );

                return;
            }

            /** If the input is already there, abort */

            if ( membersContainer.firstChild.nodeName === "INPUT" ) return;

            /** If the container is not expanded, expand it now */

            if ( ! membersContainer.parentElement.classList.contains( "active" ) ) membersContainer.parentElement.classList.add( "active" );

            this.insertAddMemberInput( membersContainer );
        });
    }



    private insertAddMemberInput(membersContainer: HTMLElement): void {

        /** Create the input, insert it and focus */
        const input = document.createElement( "input" );
        membersContainer.insertBefore( input, membersContainer.firstChild );
        input.placeholder = "Type member name";
        input.focus();

        /** Register the event listeners for the input */

        input.addEventListener( "blur", () => {
            if ( input.value ) this.createMember( input.value, membersContainer.id );
            input.parentNode.removeChild( input );
        });

        input.addEventListener( "keydown", (e: any) => {
            const key = e.which || e.keyCode;

            if ( key === 27 ) { // ESC
                input.value = null;
                input.blur();
            } else if ( key === 13 ) { // ENTER
                this.createMember( input.value, membersContainer.id );
                input.value = null;
                input.blur();
            }
        });
    }



    public teamUpdated(update: any): void {
        console.log( update );

        const { _id, name }                     = update.team;
        const { added, removed }                = update.members;

        const teamContainer                     = document.getElementById( _id );

        teamContainer.previousElementSibling.firstElementChild.innerHTML = name;

        for ( let member of removed ) {
            const memberElement = document.getElementById( `${ _id }@${ member }` );

            console.log( memberElement );

            memberElement.parentElement.removeChild( memberElement );
        }

        for ( let member of added ) {
            this.addMember( member, _id );
        }
    }
}

import {CreateTeamModel} from "../../../connection/models/CreateTeamModel";
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
import "../../../style/style-sheets/scrum-create-team.scss";
import {CreateMemberModel} from "../../../connection/models/CreateMemberModel";


// HTML
const template = require( "../../../templates/scrum-create-team.html" );






export class ScrumCreateTeam extends ViewComponent {
    private saveBtn: HTMLButtonElement;
    private exitBtn: HTMLSpanElement;
    private teamNameInput: HTMLInputElement;
    private mainMemberContainer: HTMLUListElement;
    private memberContainer: HTMLDivElement;
    private searchMembers: HTMLInputElement;

    private selectedMembers: string[];

    private searchTimer: any;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "ScrumCreateTeam" );

        this.container.innerHTML = template;

        this.saveBtn                = document.getElementById( "create-team-save-button" ) as HTMLButtonElement;
        this.exitBtn                = document.getElementById( "create-team-exit-button" ) as HTMLSpanElement;
        this.teamNameInput          = document.getElementById( "create-team-name-input" ) as HTMLInputElement;
        this.mainMemberContainer    = document.getElementById( "create-team-members-container" ) as HTMLUListElement;
        this.searchMembers          = document.getElementById( "create-team-member-search-input" ) as HTMLInputElement;

        new SimpleBar( this.mainMemberContainer );

        this.memberContainer        = this.mainMemberContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLDivElement;


        this.exitBtnHandler     = this.exitBtnHandler.bind( this );
        this.saveBtnHandler     = this.saveBtnHandler.bind( this );
        this.searchListener     = this.searchListener.bind( this );
        this.searchForMembers   = this.searchForMembers.bind( this );

        this.selectedMembers    = [];

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.exitBtn.addEventListener( "click", this.exitBtnHandler );
        this.saveBtn.addEventListener( "click", this.saveBtnHandler );
        this.searchMembers.addEventListener( "keyup", this.searchListener );
    }



    private unregisterEventListeners(): void {
        this.exitBtn.removeEventListener( "click", this.exitBtnHandler );
        this.saveBtn.removeEventListener( "click", this.saveBtnHandler );
        this.searchMembers.removeEventListener( "keyup", this.searchListener );
    }



    private exitBtnHandler() {
        this.exitScene( ViewExitTypes.HIDE_COMPONENT );
    }



    private saveBtnHandler() {
        const name = this.teamNameInput.value;

        if ( ! name ) return;

        const createTeamModel = new CreateTeamModel( name, this.selectedMembers );

        this.connection.createTeam(
            createTeamModel,
            (response: any) => {
                console.log( response );
                this.sendSignal( ScrumSignals.TEAM_CREATED, response.team );
                this.exitScene( ViewExitTypes.HIDE_COMPONENT );
            },
            (err: string) => console.error( err )
        );

    }



    private searchListener(e: any): void {
        const key = e.which || e.keyCode;

        console.log( key );

        if ( this.searchTimer ) clearTimeout( this.searchTimer );

        if ( ! this.searchMembers.value )   return this.populate();

        if ( key === 13 ) { // ENTER

            this.searchForMembers( this.searchMembers.value  )

        } else {

            if ( this.searchMembers.value.length < 2 ) return;

            this.searchTimer = setTimeout(
                this.searchForMembers,
                250,
                this.searchMembers.value
            );
        }
    }



    private resetView(): void {
        this.teamNameInput.value            = null;
        this.memberContainer.innerHTML      = null;
        this.searchMembers.value            = null;
    }



    private addMember(memberData: any): void {

        let member          = document.createElement( "li" );
        member.innerHTML    = memberData.name;
        member.id           = memberData._id;
        let checkbox        = document.createElement( "span" );
        checkbox.className  = "create-team-member-checkbox";

        member.appendChild( checkbox );

        this.memberContainer.insertBefore( member, this.memberContainer.firstChild );

        if ( this.selectedMembers.indexOf( member.id ) !== -1 ) member.classList.add( "active" );

        member.addEventListener( "click", () => {
            const memberId = member.id;

            if ( member.classList.contains( "active" ) ) {
                member.classList.remove( "active" );
                this.selectedMembers = this.selectedMembers.filter( id => id !== memberId );
            } else {
                member.classList.add( "active" );
                this.selectedMembers.push( memberId );
            }

        });

    }



    private searchForMembers(value: string): void {
        console.log( value );

        this.connection.searchMembers(
            value,
            (response: any) => {

                const { members } = response;

                this.populateMembers( members );
            },
            (err: string) => console.error( err )
        );
    }



    private populateMembers(members: any): void {
        this.memberContainer.innerHTML = null;

        for ( let member of members ) {
            this.addMember( member );
        }
    }



    private populate(): void {
        this.connection.getMembers(
            (response: any) => {
                const { members } = response;

                this.populateMembers( members );
            },
            (err: string) => console.error( err )
        )
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in scrum create team view component" );

        switch ( enterType ) {

            case ViewEnterTypes.REVEAL_COMPONENT :

                this.container.style.display = "block";
                this.populate();

                break;


            default :
                this.registerEventListeners();
                break;
        }

    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum create team view component" );

        this.selectedMembers = [];

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


import {CreateTeamModel} from "../connection/models/CreateTeamModel";
import {ViewEnterTypes} from "../core/ViewEnterTypes";
import {ViewComponent} from "../core/ViewComponent";
import {ViewExitTypes} from "../core/ViewExitTypes";
import {ScrumSignals} from "./ScrumSignals";
import {View} from "../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;


declare const SimpleBar: any;

// CSS
import "../_style/style-sheets/scrum-create-team.scss";
import {CreateMemberModel} from "../connection/models/CreateMemberModel";


// HTML
const template = require( "../_view-templates/scrum/component/scrum-create-team.html" );






export class ScrumCreateTeam extends ViewComponent {
    private saveBtn: HTMLButtonElement;
    private exitBtn: HTMLSpanElement;
    private addMemberBtn: HTMLElement;
    private teamNameInput: HTMLInputElement;
    private mainMemberContainer: HTMLUListElement;
    private memberContainer: HTMLDivElement;





    constructor(view: View, container: HTMLElement) {
        super( view, container );

        this.container.innerHTML = template;

        this.saveBtn                = document.getElementById( "create-team-save-button" ) as HTMLButtonElement;
        this.exitBtn                = document.getElementById( "create-team-exit-button" ) as HTMLSpanElement;
        this.addMemberBtn           = document.getElementById( "create-team-add-member-button" );
        this.teamNameInput          = document.getElementById( "create-team-name-input" ) as HTMLInputElement;
        this.mainMemberContainer    = document.getElementById( "create-team-members-container" ) as HTMLUListElement;

        new SimpleBar( this.mainMemberContainer );

        this.memberContainer        = this.mainMemberContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLDivElement;


        this.exitBtnHandler     = this.exitBtnHandler.bind( this );
        this.saveBtnHandler     = this.saveBtnHandler.bind( this );



        this.enterScene();
    }



    private registerEventListeners(): void {
        this.exitBtn.addEventListener( "click", this.exitBtnHandler );
        this.saveBtn.addEventListener( "click", this.saveBtnHandler );
    }



    private unregisterEventListeners(): void {
        this.exitBtn.removeEventListener( "click", this.exitBtnHandler );
        this.saveBtn.removeEventListener( "click", this.saveBtnHandler );
    }



    private exitBtnHandler(e: any) {
        this.exitScene( ViewExitTypes.HIDE_COMPONENT );
    }



    private saveBtnHandler(e: any) {
        const name = this.teamNameInput.value;

        if ( ! name ) return;

        const members = this.getSelectedMembers();

        const createTeamModel = new CreateTeamModel( name, members );

        this.connection.createTeam(
            createTeamModel,
            (response: any) => {
                console.log( response );
                this.sendSignal( ScrumSignals.TEAM_CREATED, response.team );
                this.exitScene( ViewExitTypes.HIDE_COMPONENT );
            },
            (err: string) => console.error( err )
        );


        console.log( members );
    }



    private resetView(): void {
        this.teamNameInput.value            = "";
        this.memberContainer.innerHTML      = "";
    }



    private addMember(memberData: any): void {

        let member          = document.createElement( "li" );
        member.innerHTML    = memberData.name;
        member.id           = memberData._id;
        let checkbox        = document.createElement( "span" );
        checkbox.className  = "create-team-member-checkbox";

        member.appendChild( checkbox );

        this.memberContainer.insertBefore( member, this.memberContainer.firstChild );

        member.addEventListener( "click", () => member.classList.toggle( "active" ) );


    }



    private populateMembers(): void {
        this.connection.getMembers(
            (response: any) => {
                const { members } = response;

                for ( let member of members ) {
                    this.addMember( member );
                }
            },
            (err: string) => console.error( err )
        )
    }



    private getSelectedMembers(): string[] {
        let memberIds = [];

        for ( let i = 0; i < this.memberContainer.children.length; i++ ) {
            let member = this.memberContainer.children[ i ];

            if ( member.classList.contains( "active" ) ) {
                memberIds.push( member.id );
            }
        }

        return memberIds;
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in scrum create team view component" );

        switch ( enterType ) {

            case ViewEnterTypes.REVEAL_COMPONENT :

                this.container.style.display = "block";
                this.populateMembers();

                break;


            default :
                this.registerEventListeners();
                break;
        }


    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum create team view component" );

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

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ManageTeamSignals} from "./ManageTeamSignals";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;




// HTML
const template = require( "../../../templates/manage-teams-header.html" );






export class ManageTeamsHeader extends ViewComponent {
    private exitBtn: HTMLSpanElement;

    private teamsBtn: HTMLElement;
    private membersBtn: HTMLElement;

    constructor(view: View, container: HTMLElement) {
        super( view, container, "ManageTeamsHeader" );

        this.container.innerHTML = template;

        this.exitBtn                = document.getElementById( "manage-teams-exit-button" ) as HTMLSpanElement;
        this.teamsBtn               = document.getElementById( "manage-teams-teams-btn" );
        this.membersBtn             = document.getElementById( "manage-teams-members-btn" );


        this.headerClickHandler     = this.headerClickHandler.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.exitBtn.addEventListener( "click", this.headerClickHandler );
        this.teamsBtn.addEventListener( "click", this.headerClickHandler );
        this.membersBtn.addEventListener( "click", this.headerClickHandler );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.exitBtn.removeEventListener( "click", this.headerClickHandler );
        this.teamsBtn.removeEventListener( "click", this.headerClickHandler );
        this.membersBtn.removeEventListener( "click", this.headerClickHandler );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.sendSignal( ManageTeamSignals.EXIT ); // ESCAPE
    }



    private headerClickHandler(e: any) {

        switch ( e.target.id ) {

            case this.exitBtn.id :
                this.sendSignal( ManageTeamSignals.EXIT );
                break;

            case this.teamsBtn.id :
                this.sendSignal( ManageTeamSignals.SWITCH_TO_TEAMS );
                this.membersBtn.classList.remove( "active" );
                this.teamsBtn.classList.add( "active" );
                break;

            case this.membersBtn.id:
                this.sendSignal( ManageTeamSignals.SWITCH_TO_MEMBERS );
                this.teamsBtn.classList.remove( "active" );
                this.membersBtn.classList.add( "active" );
                break;

            default :
                break;
        }

    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in manage teams header" );
        this.registerEventListeners();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in manage teams header" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }

}

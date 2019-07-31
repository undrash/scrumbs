
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;
import {ManageTeamSignals} from "./ManageTeamSignals";




// HTML
const template = require( "../../../templates/manage-teams-header.html" );






export class ManageTeamsHeader extends ViewComponent {
    private exitBtn: HTMLSpanElement;



    constructor(view: View, container: HTMLElement) {
        super( view, container, "ManageTeamsHeader" );

        this.container.innerHTML = template;
        this.exitBtn                = document.getElementById( "manage-teams-exit-button" ) as HTMLSpanElement;

        this.exitBtnHandler         = this.exitBtnHandler.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {
        this.exitBtn.addEventListener( "click", this.exitBtnHandler );
    }



    private unregisterEventListeners(): void {
        this.exitBtn.removeEventListener( "click", this.exitBtnHandler );
    }

    private exitBtnHandler(e: any) {
        this.sendSignal( ManageTeamSignals.EXIT );
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
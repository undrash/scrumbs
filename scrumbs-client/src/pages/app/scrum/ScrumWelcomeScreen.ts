

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ScrumSignals} from "./ScrumSignals";
import {View} from "../../../core/View";

import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;



// CSS
import "../../../style/style-sheets/scrum-welcome-screen.scss";


// HTML
const template = require( "../../../templates/scrum-welcome-screen.html" );






export class ScrumWelcomeScreen extends ViewComponent {

    private profileImage: HTMLElement;
    private title: HTMLElement;
    private impedimentsBtn: HTMLElement;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "ScrumWelcomeScreen" );


        /** Check in memory if the welcome screen has been hidden */
        if ( this.getMemory().hidden ) this.container.style.display = "none";

        this.container.innerHTML = template;

        this.profileImage       = document.getElementById( "scrum-welcome-screen-profile-image" );
        this.title              = document.getElementById( "scrum-welcome-screen-title" );
        this.impedimentsBtn     = document.getElementById( "scrum-welcome-screen-impediments-btn" );


        this.impedimentsListener = this.impedimentsListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.impedimentsBtn.addEventListener( "click", this.impedimentsListener );
    }



    private unregisterEventListeners(): void {
        this.impedimentsBtn.removeEventListener( "click", this.impedimentsListener );
    }



    private impedimentsListener(): void {
        this.sendSignal( ScrumSignals.SWITCH_TO_IMPEDIMENTS_VIEW );
    }



    private populate(): void {

        const userData = this.connection.getVO();

        this.title.innerText = `Welcome ${ userData.name }`;

        const names = userData.name.split( " " );

        let monogram = "";

        for ( let name of names ) {
            monogram += name[0];
        }

        this.profileImage.innerText = monogram;
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in scrum welcome screen view component" );

        this.populate();

        switch ( enterType ) {

            default :
                this.registerEventListeners();
                break;
        }
    }



    public exitScene(exitType?: string, signal?: string): void {
        console.info( "Exit being called in scrum welcome screen view component" );

        switch ( exitType ) {

            case ViewExitTypes.SWITCH_COMPONENT :

                this.container.style.display = "none";

                if ( signal ) this.sendSignal( signal );

                this.saveToMemory( { hidden: true } );

                break;

            default :
                super.exitScene( exitType );
                this.unregisterEventListeners();
                this.view.componentExited( this.name );
                break;
        }
    }
}
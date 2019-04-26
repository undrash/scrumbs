

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewNotifications} from "../ViewNotifications";
import {HeaderConstants} from "./HeaderConstants";
import {HeaderSignals} from "./HeaderSignals";
import {View} from "../../../core/View";

import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;



// CSS
import "../../../style/style-sheets/header-component.scss";



// HTML
const template = require( "../../../templates/header-component.html" );






export class HeaderComponent extends ViewComponent {

    private actionBtn: HTMLButtonElement;
    private authMessage: HTMLSpanElement;

    private authViewComponentActive: string;

    private navigation: HTMLDivElement;
    private scrumBtn: HTMLLIElement;
    private impedimentsBtn: HTMLLIElement;
    private reportsBtn: HTMLLIElement;

    private profile: HTMLUListElement;
    private authenticationFragment: HTMLElement;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "HeaderComponent" );

        this.container.innerHTML = template;

        this.authViewComponentActive = "LOGIN";

        this.actionBtn                  = document.getElementById( "header-auth-button" ) as HTMLButtonElement;
        this.authMessage                = document.getElementById( "header-auth-message" ) as HTMLSpanElement;

        this.navigation                 = document.getElementById( "header-navigation" ) as HTMLDivElement;
        this.scrumBtn                   = document.getElementById( "scrum-page-button" ) as HTMLLIElement;
        this.impedimentsBtn             = document.getElementById( "impediments-page-button" ) as HTMLLIElement;
        this.reportsBtn                 = document.getElementById( "reports-page-button" ) as HTMLLIElement;


        this.profile                    = document.getElementById( "header-profile-wrapper" ) as HTMLUListElement;
        this.authenticationFragment     = document.getElementById( "header-authentication-fragment" ) as HTMLElement;


        this.actionBtnClickListener     = this.actionBtnClickListener.bind( this );
        this.scrumBtnListener           = this.scrumBtnListener.bind( this );
        this.impedimentsBtnListener     = this.impedimentsBtnListener.bind( this );
        this.reportsBtnListener         = this.reportsBtnListener.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {
        this.actionBtn.addEventListener( "click", this.actionBtnClickListener );
        this.scrumBtn.addEventListener( "click", this.scrumBtnListener );
        this.impedimentsBtn.addEventListener( "click", this.impedimentsBtnListener );
        this.reportsBtn.addEventListener( "click", this.reportsBtnListener );
    }



    private unregisterEventListeners(): void {
        this.actionBtn.removeEventListener( "click", this.actionBtnClickListener );
        this.scrumBtn.removeEventListener( "click", this.scrumBtnListener );
        this.impedimentsBtn.removeEventListener( "click", this.impedimentsBtnListener );
        this.reportsBtn.removeEventListener( "click", this.reportsBtnListener );
    }



    private actionBtnClickListener(e: any): void {

        if ( this.authViewComponentActive === "LOGIN" ) {
            this.sendSignal( HeaderSignals.SWITCH_TO_SIGNUP );

            this.actionBtn.innerHTML        = "Log In";
            this.authMessage.innerHTML      = "Already have an account?";
            this.authViewComponentActive    = "SIGNUP";
        } else {
            this.sendSignal( HeaderSignals.SWITCH_TO_LOGIN );

            this.actionBtn.innerHTML        = "Sign Up";
            this.authMessage.innerHTML      = "Don't have an account?";
            this.authViewComponentActive    = "LOGIN";
        }

    }



    private scrumBtnListener(): void {
        this.sendSignal( HeaderSignals.SWITCH_TO_SCRUM_VIEW );
    }



    private impedimentsBtnListener(): void {
        this.sendSignal( HeaderSignals.SWITCH_TO_IMPEDIMENTS_VIEW );
    }



    private reportsBtnListener(): void {
        this.sendSignal( HeaderSignals.SWITCH_TO_REPORTS_VIEW );
    }



    public setActiveMenuItem(notification: string): void {

        for ( let i = 0; i < this.navigation.children.length; i++ ) {
            this.navigation.children[i].classList.remove( "active" );
        }

        switch ( notification ) {

            case ViewNotifications.SWITCH_TO_SCRUM_VIEW :

                this.scrumBtn.classList.add( "active" );

                break;

            case ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW :

                this.impedimentsBtn.classList.add( "active" );

                break;

            case ViewNotifications.SWITCH_TO_REPORTS_VIEW :

                this.reportsBtn.classList.add( "active" );

                break;

            default :
                break;
        }


    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in authentication header view component" );

        if ( enterType === ViewEnterTypes.REVEAL_COMPONENT ) {

            TweenLite.to( this.container, 0.4, { marginTop: 0, ease: Back.easeOut.config( 0.35 ) } );

        } else {
            this.registerEventListeners();
        }


    }



    public exitScene(exitType?: string): void {

        console.info( "Exit being called in authentication header view component" );

        if ( exitType === ViewExitTypes.HIDE_COMPONENT ) {

            TweenLite.to( this.container, 0.4, { marginTop: -70, ease: Power0.easeOut } );


        } else {
            super.exitScene( exitType );
            this.unregisterEventListeners();
            this.view.componentExited( this.name );

        }

    }



    public switchState(toState: string): void {

        switch ( toState ) {

            case HeaderConstants.HEADER_APP_STATE :

                this.authenticationFragment.style.display   = "none";
                this.navigation.style.display               = "block";
                this.profile.style.display                  = "block";

                break;

            case HeaderConstants.HEADER_AUTH_STATE :


                break;


            default :
                break;
        }
    }
}
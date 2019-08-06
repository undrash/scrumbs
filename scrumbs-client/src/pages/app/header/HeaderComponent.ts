

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewNotifications} from "../ViewNotifications";
import {HeaderConstants} from "./HeaderConstants";
import {HeaderSignals} from "./HeaderSignals";
import {View} from "../../../core/View";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;


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

    private notifications: HTMLElement;
    private notificationDropdown: HTMLElement;
    private inquiry: HTMLElement;
    private inquiryNotification: HTMLElement;
    private inquiryToolTip: HTMLElement;

    private headerProfile: HTMLElement;
    private profileDropdownBtn: HTMLElement;
    private userOptionsPanel: HTMLElement;
    private profileAvatar: HTMLElement;
    private profileUserName: HTMLElement;

    private panelOptionSettings: HTMLElement;

    private avatar: HTMLElement;


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


        this.notifications              = document.getElementById( "profile-notifications" );
        this.notificationDropdown       = document.getElementById( "header-notifications-dropdown" );
        this.inquiry                    = document.getElementById( "profile-inquiry" );

        this.inquiryNotification        = document.getElementById( "profile-inquiry-notification" );
        this.inquiryToolTip             = document.getElementById( "inquiry-tooltip-container" );

        this.avatar                     = document.getElementById( "profile-avatar" );

        this.headerProfile              = document.getElementById( "header-profile-wrapper" );
        this.profileDropdownBtn         = document.getElementById( "profile-dropdown-button" );
        this.userOptionsPanel           = document.getElementById( "user-options-panel" );
        this.profileAvatar              = document.getElementById( "profile-avatar-dropdown" );
        this.profileUserName            = document.getElementById( "profile-user-name-dropdown" );

        this.panelOptionSettings        = document.getElementById( "user-settings-btn" );

        this.actionBtnClickListener     = this.actionBtnClickListener.bind( this );
        this.scrumBtnListener           = this.scrumBtnListener.bind( this );
        this.impedimentsBtnListener     = this.impedimentsBtnListener.bind( this );
        this.reportsBtnListener         = this.reportsBtnListener.bind( this );
        this.showInquiryToolTip         = this.showInquiryToolTip.bind( this );
        this.hideInquiryToolTip         = this.hideInquiryToolTip.bind( this );
        this.inquiryBtnClickListener    = this.inquiryBtnClickListener.bind( this );
        this.profileListener            = this.profileListener.bind( this );
        this.documentClickListener      = this.documentClickListener.bind( this );
        this.settingsBtnListener        = this.settingsBtnListener.bind( this );
        this.notificationHandler        = this.notificationHandler.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.actionBtn.addEventListener( "click", this.actionBtnClickListener );
        this.scrumBtn.addEventListener( "click", this.scrumBtnListener );
        this.impedimentsBtn.addEventListener( "click", this.impedimentsBtnListener );
        this.reportsBtn.addEventListener( "click", this.reportsBtnListener );
        this.inquiry.addEventListener( "mouseenter", this.showInquiryToolTip );
        this.inquiry.addEventListener( "mouseleave", this.hideInquiryToolTip );
        this.inquiry.addEventListener( "click", this.inquiryBtnClickListener );
        this.headerProfile.addEventListener( "click", this.profileListener );
        this.panelOptionSettings.addEventListener( "click", this.settingsBtnListener );
        this.notifications.addEventListener( "click", this.notificationHandler );
        document.addEventListener( "click", this.documentClickListener );
    }



    private unregisterEventListeners(): void {
        this.actionBtn.removeEventListener( "click", this.actionBtnClickListener );
        this.scrumBtn.removeEventListener( "click", this.scrumBtnListener );
        this.impedimentsBtn.removeEventListener( "click", this.impedimentsBtnListener );
        this.reportsBtn.removeEventListener( "click", this.reportsBtnListener );
        this.inquiry.removeEventListener( "mouseenter", this.showInquiryToolTip );
        this.inquiry.removeEventListener( "mouseleave", this.hideInquiryToolTip );
        this.inquiry.removeEventListener( "click", this.inquiryBtnClickListener );
        this.headerProfile.removeEventListener( "click", this.profileListener );
        this.panelOptionSettings.removeEventListener( "click", this.settingsBtnListener );
        this.notifications.removeEventListener( "click", this.notificationHandler );
        document.removeEventListener( "click", this.documentClickListener );
    }



    private notificationHandler(): void {
        this.notificationDropdown.style.display = "block";
    }



    private documentClickListener(e: any): void {

        if ( e.target.id !== this.headerProfile.id ) {
            this.profileDropdownBtn.classList.remove( "active" );
            this.userOptionsPanel.style.display = "none";
        }


        if ( e.target.id !== this.notifications.id ) {
            this.notificationDropdown.style.display = "none";
        }

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



    private inquiryBtnClickListener(): void {
        this.sendSignal( HeaderSignals.DISPLAY_INQUIRY );
    }



    private settingsBtnListener(): void {
        this.sendSignal( HeaderSignals.SWITCH_TO_ACCOUNT_SETTINGS_VIEW );
    }



    private profileListener(): void {
        if ( this.profileDropdownBtn.classList.contains( "active" ) ) {
            this.userOptionsPanel.style.display = "none";
            this.profileDropdownBtn.classList.remove( "active" );
        } else {
            this.userOptionsPanel.style.display = "block";
            this.profileDropdownBtn.classList.add( "active" );

        }
    }


    private showInquiryToolTip(): void {

        TweenLite.to( this.inquiryNotification, 0.15, { opacity: 0, onComplete: () => {
            this.inquiryNotification.style.display = "none";
        }});

        this.inquiryToolTip.style.display = "block";

        TweenLite.to( this.inquiryToolTip, 0.2, { opacity: 1 } );
    }



    private hideInquiryToolTip(): void {

        TweenLite.to( this.inquiryToolTip, 0.1, { opacity: 0, onComplete: () => {
            this.inquiryToolTip.style.display = "none";
        }});
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



    public populate(): void {
        const userData = this.connection.getVO();

        const names = userData.name.split( " " );

        let monogram = "";

        for ( let name of names ) {
            monogram += name[0];
        }

        this.avatar.innerText           = monogram;
        this.profileAvatar.innerText    = monogram;
        this.profileUserName.innerText  = userData.name;
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

                this.populate();

                break;

            case HeaderConstants.HEADER_AUTH_STATE :


                break;


            default :
                break;
        }
    }
}
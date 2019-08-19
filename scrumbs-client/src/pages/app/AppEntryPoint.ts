
import {AuthenticationNotifications} from "./authentication/AuthenticationNotifications";
import {CreateImpedimentView} from "./create-impediment/CreateImpedimentView";
import {AccountSettingsView} from "./account-settings/AccountSettingsView";
import {AuthenticationView} from "./authentication/AuthenticationView";
import {ConnectionProxy} from "../../connection/ConnectionProxy";
import {ManageTeamsView} from "./manage-teams/ManageTeamsView";
import {ImpedimentsView} from "./impediments/ImpedimentsView";
import {CreateTeamView} from "./create-team/CreateTeamView";
import {ViewExitTypes} from "../../core/ViewExitTypes";
import {INotification} from "../../core/INotification";
import {ViewNotifications} from "./ViewNotifications";
import {ViewManager} from "../../core/ViewManager";
import {Onboarding} from "./onboarding/Onboarding";
import {ReportsView} from "./reports/ReportsView";
import {CoreEntity} from "../../core/CoreEntity";
import {HeaderView} from "./header/HeaderView";
import {ScrumView} from "./scrum/ScrumView";
import {Flows} from "./onboarding/Flows";
import {View} from "../../core/View";


import "../../style/style-sheets/screensize-not-supported.scss";


const screenNotSupportedTemplate = require("../../templates/screensize-not-supported.html" );


declare const boardme: any;



export class AppViewManager extends ViewManager {
    private headerView: View;

    private alertScreenSizeNotSupported: HTMLElement;




    constructor() {
        super();

        this.alertScreenSizeNotSupported = document.createElement( "div" );
        this.alertScreenSizeNotSupported.id = "screen-not-supported-alert";

        this.alertScreenSizeNotSupported.innerHTML = screenNotSupportedTemplate;

        document.body.appendChild( this.alertScreenSizeNotSupported );

        this.headerView = new HeaderView();

        if ( ConnectionProxy.EXTERNAL_AUTH ) {
            this.initView( ScrumView );
            this.sendNotification( ViewNotifications.SWITCH_HEADER_STATE );

            this.onboarding.initFlow( Flows.WELCOME );

            boardme.run( "boardme:welcome" );
        } else {
            this.initView( AuthenticationView );
        }

    }



    public listNotificationInterests(): any[] {

        let notifications = [];


        notifications.push( AuthenticationNotifications.LOGIN );
        notifications.push( AuthenticationNotifications.SIGN_UP );

        notifications.push( ViewNotifications.SWITCH_TO_SCRUM_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_CREATE_IMPEDIMENT_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_MANAGE_TEAMS_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_CREATE_TEAM_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_REPORTS_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_ACCOUNT_SETTINGS_VIEW );

        notifications.push( ViewNotifications.SWITCH_TO_PREVIOUS_VIEW );

        notifications.push( ViewNotifications.INIT_ONBOARDING_MEMBER_EDIT_FLOW );
        notifications.push( ViewNotifications.INIT_ONBOARDING_IMPEDIMENT_FEATURE_FLOW );
        notifications.push( ViewNotifications.CLEAR_ONBOARDING );

        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {

            case AuthenticationNotifications.LOGIN :
            case AuthenticationNotifications.SIGN_UP :
            case ViewNotifications.SWITCH_TO_SCRUM_VIEW :

                this.onboarding.setGuidesDisplayed(
                    this.connection.getVO().onboardingGuidesDisplayed
                );

                this.switchView( ScrumView, null );

                this.onboarding.initFlow( Flows.WELCOME );

                boardme.run( "boardme:welcome" );

                break;

            case ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW :

                this.switchView( ImpedimentsView, null );

                break;


            case ViewNotifications.SWITCH_TO_CREATE_IMPEDIMENT_VIEW :

                this.switchView( CreateImpedimentView, null );

                break;

            case ViewNotifications.SWITCH_TO_REPORTS_VIEW :

                this.switchView( ReportsView, null );

                break;

            case ViewNotifications.SWITCH_TO_MANAGE_TEAMS_VIEW :

                this.switchView( ManageTeamsView, null );

                this.onboarding.initFlow( Flows.MANAGE_TEAMS );

                boardme.run( "boardme:mange-teams" );

                break;

            case ViewNotifications.SWITCH_TO_CREATE_TEAM_VIEW :

                this.switchView( CreateTeamView, null );

                break;

            case ViewNotifications.SWITCH_TO_ACCOUNT_SETTINGS_VIEW :

                this.switchView( AccountSettingsView, null );

                break;

            case ViewNotifications.SWITCH_TO_PREVIOUS_VIEW :

                this.switchView( this.previousViewCtor, null );

                break;

            case ViewNotifications.INIT_ONBOARDING_MEMBER_EDIT_FLOW :

                this.onboarding.initFlow( Flows.MEMBER_EDIT );

                boardme.run( "boardme:member-edit" );

                break;

            case ViewNotifications.INIT_ONBOARDING_IMPEDIMENT_FEATURE_FLOW :

                this.onboarding.initFlow( Flows.IMPEDIMENTS_FEATURE );


                boardme.run( "boardme:impediment-feature" );

                break;

            case ViewNotifications.CLEAR_ONBOARDING :

                this.onboarding.clearGuides();

                break;

            default :
                break;
        }
    }

}


window.onload = () => {

    new AppViewManager();
};
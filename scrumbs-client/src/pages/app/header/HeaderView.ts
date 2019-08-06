

import {AuthenticationNotifications} from "../authentication/AuthenticationNotifications";
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {HeaderNotifications} from "./HeaderNotifications";
import {ViewNotifications} from "../ViewNotifications";
import {HeaderComponent} from "./HeaderComponent";
import {HeaderConstants} from "./HeaderConstants";
import {HeaderSignals} from "./HeaderSignals";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";
import {Inquiry} from "./Inquiry";


// CSS
import "../../../style/style-sheets/header-view.scss";


// HTML
const headerViewTemplate = require( "../../../templates/header-view.html" );






export class HeaderView extends View {
    private header: ViewComponent;
    private inquiry: Inquiry;

    private headerContainer: HTMLElement;
    private inquiryContainer: HTMLElement;




    constructor() {
        super( "HeaderView" );

        this.container = document.createElement( "div" );
        this.container.id = "header-view-container";

        document.getElementById( SystemConstants.HEADING_CONTAINER ).appendChild( this.container );

        this.container.innerHTML = headerViewTemplate;

        this.headerContainer    = document.getElementById( "header-component-container" );
        this.inquiryContainer   = document.getElementById( "header-inquiry-container" );

        this.header             = new HeaderComponent( this, this.headerContainer );
        this.inquiry            = new Inquiry( this, this.inquiryContainer );

        this.enterScene();
    }



    public enterScene(): void {


    }



    public exitScene(exitType: string, callback: Function): void {

        this.exitCallback = callback;

        this.header.exitScene( exitType );
        this.inquiry.exitScene( exitType );
    }



    public listNotificationInterests(): string[] {
        let notifications = super.listNotificationInterests();

        notifications.push( AuthenticationNotifications.LOGIN );
        notifications.push( AuthenticationNotifications.SIGN_UP );

        notifications.push( AuthenticationNotifications.EXIT_HEADER );
        notifications.push( AuthenticationNotifications.ENTER_HEADER );

        notifications.push( ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_SCRUM_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_REPORTS_VIEW );

        notifications.push( ViewNotifications.SWITCH_HEADER_STATE );

        return notifications;
    }



    public handleNotification(notification: INotification): void {

        switch ( notification.name ) {

            case AuthenticationNotifications.LOGIN :
            case AuthenticationNotifications.SIGN_UP :
            case ViewNotifications.SWITCH_HEADER_STATE :

                ( this.header as HeaderComponent ).switchState( HeaderConstants.HEADER_APP_STATE );

                break;

            case AuthenticationNotifications.EXIT_HEADER :

                this.header.exitScene( ViewExitTypes.HIDE_COMPONENT );

                break;

            case AuthenticationNotifications.ENTER_HEADER :

                this.header.enterScene( ViewEnterTypes.REVEAL_COMPONENT );

                break;


            case ViewNotifications.SWITCH_TO_SCRUM_VIEW :
            case ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW :
            case ViewNotifications.SWITCH_TO_REPORTS_VIEW :

                ( this.header as HeaderComponent ).setActiveMenuItem( notification.name );

                break;

            default :
                break;
        }

    }



    public handleSignal(signal: ISignal) {
        console.log( "Signal received in " + this.NAME + ": " + signal.name );

        switch ( signal.name ) {

            case HeaderSignals.SWITCH_TO_SIGNUP :

                this.sendNotification( HeaderNotifications.SWITCH_TO_SIGNUP );

                break;

            case HeaderSignals.SWITCH_TO_LOGIN :

                this.sendNotification( HeaderNotifications.SWITCH_TO_LOGIN );

                break;

            case HeaderSignals.SWITCH_TO_SCRUM_VIEW :

                this.sendNotification( ViewNotifications.SWITCH_TO_SCRUM_VIEW );

                break;

            case HeaderSignals.SWITCH_TO_IMPEDIMENTS_VIEW :

                this.sendNotification( ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW );

                break;

            case HeaderSignals.SWITCH_TO_REPORTS_VIEW :

                this.sendNotification( ViewNotifications.SWITCH_TO_REPORTS_VIEW );

                break;

            case HeaderSignals.SWITCH_TO_ACCOUNT_SETTINGS_VIEW :

                this.sendNotification( ViewNotifications.SWITCH_TO_ACCOUNT_SETTINGS_VIEW );

                break;

            case HeaderSignals.DISPLAY_INQUIRY :

                this.inquiry.enterScene( ViewEnterTypes.REVEAL_COMPONENT );

                break;

            default:
                break;
        }

    }

}
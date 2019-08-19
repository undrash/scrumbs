

import {AuthenticationForgotPassword} from "./AuthenticationForgotPassword";
import {AuthenticationNotifications} from "./AuthenticationNotifications";
import {HeaderNotifications} from "../header/HeaderNotifications";
import {AuthenticationSignals} from "./AuthenticationSignals";
import {AuthenticationSignUp} from "./AuthenticationSignUp";
import {AuthenticationLogin} from "./AuthenticationLogin";
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";


// CSS
import "../../../style/style-sheets/authentication-view.scss";
import "../../../style/style-sheets/authentication-common.scss";


// HTML
const authenticationViewTemplate = require( "../../../templates/authentication-view.html" );





export class AuthenticationView extends View {
    private authenticationLogin: ViewComponent;
    private authenticationSignUp: ViewComponent;
    private authenticationForgotPassword: ViewComponent;

    private authenticationLoginContainer: HTMLElement;
    private authenticationSignUpContainer: HTMLElement;
    private authenticationForgotPasswordContainer: HTMLElement;





    constructor() {
        super( "AuthenticationView" );

        this.container = document.createElement( "div" );
        this.container.id = "authentication-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML = authenticationViewTemplate;

        this.authenticationLoginContainer           = document.getElementById( "authentication-log-in-container" );
        this.authenticationSignUpContainer          = document.getElementById( "authentication-sign-up-container" );
        this.authenticationForgotPasswordContainer  = document.getElementById( "authentication-forgot-password-container" );


        this.authenticationLogin            = new AuthenticationLogin( this, this.authenticationLoginContainer );
        this.authenticationSignUp           = new AuthenticationSignUp( this, this.authenticationSignUpContainer );
        this.authenticationForgotPassword   = new AuthenticationForgotPassword( this, this.authenticationForgotPasswordContainer );


        this.enterScene();
    }



    public enterScene(): void {


    }



    public exitScene( exitType: string, callback: Function ): void {

        this.exitCallback = callback;

        this.authenticationLogin.exitScene( exitType );
        this.authenticationSignUp.exitScene( exitType );
        this.authenticationForgotPassword.exitScene( exitType );
    }



    public listNotificationInterests(): string[] {
        let notifications = super.listNotificationInterests();

        notifications.push( HeaderNotifications.SWITCH_TO_SIGNUP );
        notifications.push( HeaderNotifications.SWITCH_TO_LOGIN );

        return notifications;
    }



    public handleNotification(notification: INotification): void {
        console.log( "Notification received in " + this.NAME + ": " + notification.name );

        switch ( notification.name ) {

            case HeaderNotifications.SWITCH_TO_SIGNUP :

                this.authenticationLogin.exitScene( ViewExitTypes.SWITCH_COMPONENT, AuthenticationSignals.SWITCH_LOGIN_TO_SIGNUP );

                break;

            case HeaderNotifications.SWITCH_TO_LOGIN :

                this.authenticationSignUp.exitScene( ViewExitTypes.SWITCH_COMPONENT, AuthenticationSignals.SWITCH_SIGNUP_TO_LOGIN );

                break;
                

            default :
                break;
        }

    }



    public handleSignal(signal: ISignal) {
        console.log( "Signal received in " + this.NAME + ": " + signal.name );

        switch ( signal.name ) {

            case AuthenticationSignals.SWITCH_LOGIN_TO_SIGNUP :

                this.authenticationSignUp.enterScene( ViewEnterTypes.SWITCH_COMPONENT );

                break;

            case AuthenticationSignals.SWITCH_SIGNUP_TO_LOGIN :

                this.authenticationLogin.enterScene( ViewEnterTypes.SWITCH_COMPONENT );

                break;


            case AuthenticationSignals.SWITCH_LOGIN_TO_FORGOT_PASSWORD :

                this.sendNotification( AuthenticationNotifications.EXIT_HEADER );

                this.authenticationForgotPassword.enterScene( ViewEnterTypes.SWITCH_COMPONENT );

                break;

            case AuthenticationSignals.SWITCH_FORGOT_PASSWORD_TO_LOGIN :

                this.sendNotification( AuthenticationNotifications.ENTER_HEADER );

                this.authenticationLogin.enterScene( ViewEnterTypes.SWITCH_COMPONENT );

                break;


            case AuthenticationSignals.LOGIN :

                this.sendNotification( AuthenticationNotifications.LOGIN );

                break;


            case AuthenticationSignals.SIGN_UP :

                this.sendNotification( AuthenticationNotifications.SIGN_UP );


                break;

            default:
                break;
        }
    }

}
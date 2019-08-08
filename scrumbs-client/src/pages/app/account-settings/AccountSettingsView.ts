
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {AccountNotifications} from "./AccountNotifications";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewNotifications} from "../ViewNotifications";
import {AccountSettings} from "./AccountSettings";
import {AccountSignals} from "./AccountSignals";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";


// CSS
import "../../../style/style-sheets/account-settings-view.scss";



// HTML
const accountSettingsTemplate = require( "../../../templates/account-settings-view.html" );






export class AccountSettingsView extends View {

    private accountSettingsContainer: HTMLElement;

    private accountSettings: AccountSettings;

    private isForegroundActive: boolean;

    constructor() {
        super( "AccountSettingsView" );

        this.container      = document.createElement( "div" );
        this.container.id   = "account-settings-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML        = accountSettingsTemplate;

        this.accountSettingsContainer   = document.getElementById( "account-settings-container" );

        this.accountSettings            = new AccountSettings( this, this.accountSettingsContainer );

        this.enterScene();
    }



    public enterScene(): void {}



    public exitScene( exitType: string, callback: Function ): void {

        this.exitCallback = callback;

        this.accountSettings.exitScene( exitType );
    }



    public listNotificationInterests(): string[] {
        let notifications = super.listNotificationInterests();


        return notifications;
    }



    public handleNotification(notification: INotification): void {
        console.log( "Notification received in " + this.NAME + ": " + notification.name );

        switch ( notification.name ) {


            default :
                break;
        }

    }



    public handleSignal(signal: ISignal) {
        console.log( "Signal received in " + this.NAME + ": " + signal.name );

        switch ( signal.name ) {

            case AccountSignals.ACCOUNT_UPDATED :

                this.sendNotification( AccountNotifications.ACCOUNT_UPDATED );

                break;

            case AccountSignals.EXIT :

                if ( ! this.isForegroundActive ) this.sendNotification( ViewNotifications.SWITCH_TO_SCRUM_VIEW );

                break;

            case AccountSignals.FOREGROUND_ACTIVE :

                this.isForegroundActive = true;

                break;

            case AccountSignals.FOREGROUND_INACTIVE :

                this.isForegroundActive = false;

                break;

            default:
                break;
        }
    }

}
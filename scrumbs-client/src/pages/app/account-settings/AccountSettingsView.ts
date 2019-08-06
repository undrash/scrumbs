


import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {AccountSettings} from "./AccountSettings";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";


// CSS
import "../../../style/style-sheets/account-settings-view.scss";


// HTML
const accountSettingsTemplate = require( "../../../templates/account-settings-view.html" );






export class AccountSettingsView extends View {

    private accountSettingsContainer: HTMLElement;

    private accountSettings: AccountSettings;



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


            default:
                break;
        }
    }

}



import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";


// CSS
import "../../../style/style-sheets/reports-view.scss";


// HTML
const reportsViewTemplate = require( "../../../templates/reports-view.html" );






export class ReportsView extends View {





    constructor() {
        super( "ReportsView" );

        this.container      = document.createElement( "div" );
        this.container.id   = "reports-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML = reportsViewTemplate;

        this.enterScene();
    }



    public enterScene(): void {


    }



    public exitScene( exitType: string, callback: Function ): void {

        this.exitCallback = callback;

        // TODO Andrei: exit components

        this.container.parentNode.removeChild( this.container );
        this.unregister();

        if ( this.exitCallback ) this.exitCallback();
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
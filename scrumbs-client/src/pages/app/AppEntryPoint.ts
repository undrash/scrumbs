

import {AuthenticationNotifications} from "./authentication/AuthenticationNotifications";
import {AuthenticationView} from "./authentication/AuthenticationView";
import {HeaderNotifications} from "./header/HeaderNotifications";
import {ImpedimentsView} from "./impediments/ImpedimentsView";
import {ViewExitTypes} from "../../core/ViewExitTypes";
import {INotification} from "../../core/INotification";
import {ViewNotifications} from "./ViewNotifications";
import {ViewManager} from "../../core/ViewManager";
import {ReportsView} from "./reports/ReportsView";
import {CoreEntity} from "../../core/CoreEntity";
import {HeaderView} from "./header/HeaderView";
import {ScrumView} from "./scrum/ScrumView";
import {View} from "../../core/View";




export class AppViewManager extends ViewManager {
    private headerView: View;






    constructor() {
        super();
        this.headerView = new HeaderView();
        this.initView( AuthenticationView );
    }



    public listNotificationInterests(): any[] {

        let notifications = [];


        notifications.push( AuthenticationNotifications.LOGIN );
        notifications.push( AuthenticationNotifications.SIGN_UP );
        notifications.push( ViewNotifications.SWITCH_TO_SCRUM_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW );
        notifications.push( ViewNotifications.SWITCH_TO_REPORTS_VIEW );

        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {

            case AuthenticationNotifications.LOGIN :

                this.switchView( ScrumView, null );

                break;

            case AuthenticationNotifications.SIGN_UP :

                this.switchView( ScrumView, null );

                break;

            case ViewNotifications.SWITCH_TO_SCRUM_VIEW :

                this.switchView( ScrumView, null );

                break;

            case ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW :

                this.switchView( ImpedimentsView, null );

                break;

            case ViewNotifications.SWITCH_TO_REPORTS_VIEW :

                this.switchView( ReportsView, null );

                break;

            default :
                break;
        }
    }

}


window.onload = () => {

    new AppViewManager();
};
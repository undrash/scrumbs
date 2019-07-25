

import {AuthenticationNotifications} from "./authentication/AuthenticationNotifications";
import {AuthenticationView} from "./authentication/AuthenticationView";
import {ConnectionProxy} from "../../connection/ConnectionProxy";
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
import {Onboarding} from "./onboarding/Onboarding";




export class AppViewManager extends ViewManager {
    private headerView: View;

    private onboarding: Onboarding;




    constructor() {
        super();

        this.onboarding = new Onboarding();

        this.headerView = new HeaderView();

        if ( ConnectionProxy.EXTERNAL_AUTH ) {
            this.initView( ScrumView );
            this.sendNotification( ViewNotifications.SWITCH_HEADER_STATE );

            this.onboarding.initWelcomeFlow();
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
        notifications.push( ViewNotifications.SWITCH_TO_REPORTS_VIEW );

        notifications.push( ViewNotifications.INIT_SCRUM_ONBOARDING );

        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {

            case AuthenticationNotifications.LOGIN :
            case AuthenticationNotifications.SIGN_UP :
            case ViewNotifications.SWITCH_TO_SCRUM_VIEW :

                this.switchView( ScrumView, null );

                this.onboarding.initWelcomeFlow();

                break;

            case ViewNotifications.SWITCH_TO_IMPEDIMENTS_VIEW :

                this.switchView( ImpedimentsView, null );

                break;

            case ViewNotifications.SWITCH_TO_REPORTS_VIEW :

                this.switchView( ReportsView, null );

                break;

            case ViewNotifications.INIT_SCRUM_ONBOARDING :

                this.onboarding.initMemberFlow();

                this.onboarding.initImpedimentFlow();

                break;

            default :
                break;
        }
    }

}


window.onload = () => {

    new AppViewManager();
};
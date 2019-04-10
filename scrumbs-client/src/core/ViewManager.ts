

import { INotification } from "./INotification";
import { ViewExitTypes } from "./ViewExitTypes";
import { CoreEntity } from "./CoreEntity";
import { View } from "./View";


// CSS
import "../style/style-sheets/main.scss";


export class ViewManager extends CoreEntity {

    protected currentView: View;





    constructor() {
        super( "ViewManager" );

    }



    protected initView(view: any): void {
        this.currentView = new view();
    }



    protected switchView(view: any, exitType?: string, callback?: Function): void {

        if ( ! exitType ) exitType = ViewExitTypes.DEFAULT;

        this.currentView.exitScene( exitType, () => {

            this.currentView = new view();

            if ( callback ) callback();

        });
    }



    public listNotificationInterests(): any[] {

        let notifications = [];


        notifications.push( "" );


        return notifications;
    }



    public handleNotification(notification: INotification) {

        switch ( notification.name ) {



            default :
                break;
        }

    }

}
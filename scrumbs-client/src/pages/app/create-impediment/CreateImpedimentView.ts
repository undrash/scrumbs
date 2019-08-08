
import {CreateImpedimentSignals} from "./CreateImpedimentSignals";
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewNotifications} from "../ViewNotifications";
import {CreateImpediment} from "./CreateImpediment";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";



// HTML
const createImpedimentTemplate = require( "../../../templates/create-impediment-view.html" );





export class CreateImpedimentView extends View {

    private createImpedimentContainer: HTMLElement;
    private createImpediment: ViewComponent;



    constructor() {
        super( "CreateImpedimentView" );

        this.container              = document.createElement( "div" );
        this.container.id           = "create-impediment-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML    = createImpedimentTemplate;

        this.createImpedimentContainer    = document.getElementById( "create-impediment-container" );

        this.createImpediment             = new CreateImpediment( this, this.createImpedimentContainer );

        this.enterScene();
    }



    public enterScene(): void {}



    public exitScene( exitType: string, callback: Function ): void {

        this.exitCallback = callback;

        this.createImpediment.exitScene( exitType );
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

            case CreateImpedimentSignals.EXIT :

                this.sendNotification( ViewNotifications.SWITCH_TO_PREVIOUS_VIEW );

                break;

            default:
                break;
        }
    }

}

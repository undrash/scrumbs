
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewNotifications} from "../ViewNotifications";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";
import {CreateTeam} from "./CreateTeam";
import {CreateTeamSignals} from "./CreateTeamSignals";



// HTML
const createTeamTemplate = require( "../../../templates/create-team-view.html" );





export class CreateTeamView extends View {

    private createTeamContainer: HTMLElement;
    private createTeam: ViewComponent;



    constructor() {
        super( "CreateTeamView" );

        this.container              = document.createElement( "div" );
        this.container.id           = "manage-teams-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML    = createTeamTemplate;

        this.createTeamContainer    = document.getElementById( "create-team-container" );

        this.createTeam             = new CreateTeam( this, this.createTeamContainer );

        this.enterScene();
    }



    public enterScene(): void {}



    public exitScene( exitType: string, callback: Function ): void {

        this.exitCallback = callback;

        this.createTeam.exitScene( exitType );
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

            case CreateTeamSignals.EXIT :

                this.sendNotification( ViewNotifications.SWITCH_TO_PREVIOUS_VIEW );

                break;

            default:
                break;
        }
    }

}

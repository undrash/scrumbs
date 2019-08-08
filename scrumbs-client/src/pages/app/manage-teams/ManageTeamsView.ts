
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewNotifications} from "../ViewNotifications";
import {ManageTeamsHeader} from "./ManageTeamsHeader";
import {ManageTeamSignals} from "./ManageTeamSignals";
import {ISignal} from "../../../core/ISignal";
import {ManageMembers} from "./ManageMembers";
import {ManageTeams} from "./ManageTeams";
import {View} from "../../../core/View";


// CSS
import "../../../style/style-sheets/manage-teams-view.scss";



// HTML
const manageTeamsTemplate = require( "../../../templates/manage-teams-view.html" );






export class ManageTeamsView extends View {

    private headerContainer: HTMLElement;
    private teamsContainer: HTMLElement;
    private membersContainer: HTMLElement;

    private header: ViewComponent;
    private teams: ViewComponent;
    private members: ViewComponent;

    private isForegroundActive: boolean;

    constructor() {
        super( "ManageTeamsView" );

        this.container              = document.createElement( "div" );
        this.container.id           = "manage-teams-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML    = manageTeamsTemplate;

        this.headerContainer        = document.getElementById( "manage-teams-header-container" );
        this.teamsContainer         = document.getElementById( "manage-teams-container" );
        this.membersContainer       = document.getElementById( "manage-members-container" );

        this.header                 = new ManageTeamsHeader( this, this.headerContainer  );
        this.teams                  = new ManageTeams( this, this.teamsContainer );
        this.members                = new ManageMembers( this, this.membersContainer );



        this.enterScene();
    }



    public enterScene(): void {}



    public exitScene( exitType: string, callback: Function ): void {

        this.exitCallback = callback;

        this.header.exitScene( exitType );
        this.teams.exitScene( exitType );
        this.members.exitScene( exitType );
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

            case ManageTeamSignals.SWITCH_TO_TEAMS :

                this.members.exitScene( ViewExitTypes.SWITCH_COMPONENT );
                this.teams.enterScene( ViewExitTypes.SWITCH_COMPONENT );


                break;

            case ManageTeamSignals.SWITCH_TO_MEMBERS :

                this.sendNotification( ViewNotifications.CLEAR_ONBOARDING );

                this.teams.exitScene( ViewExitTypes.SWITCH_COMPONENT );
                this.members.enterScene( ViewExitTypes.SWITCH_COMPONENT );

                break;


            case ManageTeamSignals.FOREGROUND_ACTIVE :

                this.isForegroundActive = true;

                break;

            case ManageTeamSignals.FOREGROUND_INACTIVE :

                this.isForegroundActive = false;

                break;

            case ManageTeamSignals.EXIT :

                if ( ! this.isForegroundActive ) this.sendNotification( ViewNotifications.SWITCH_TO_SCRUM_VIEW );

                break;

            case ManageTeamSignals.CREATE_TEAM :

                this.sendNotification( ViewNotifications.SWITCH_TO_CREATE_TEAM_VIEW );

                break;

            default:
                break;
        }
    }

}
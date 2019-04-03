

import {ScrumWelcomeScreen} from "./ScrumWelcomeScreen";
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {INotification} from "../../../core/INotification";
import {ScrumManageTeams} from "./ScrumManageTeams";
import {ViewComponent} from "../../../core/ViewComponent";
import {ScrumCreateTeam} from "./ScrumCreateTeam";
import {ScrumTeams} from "./ScrumTeams";
import {ScrumNotes} from "./ScrumNotes";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";


// CSS
import "../../../style/style-sheets/scrum-view.scss";
import {ScrumSignals} from "./ScrumSignals";



// HTML
const authenticationViewTemplate = require( "../templates/scrum/view/scrum-view.html" );






export class ScrumView extends View {
    private teams: ViewComponent;
    private notes: ViewComponent;
    private welcomeScreen: ViewComponent;
    private createTeam: ViewComponent;
    private manageTeams: ViewComponent;

    private teamsContainer: HTMLElement;
    private notesContainer: HTMLElement;
    private welcomeScreenContainer: HTMLElement;
    private createTeamContainer: HTMLElement;
    private mangeTeamsContainer: HTMLElement;





    constructor() {
        super( "ScrumView" );

        this.container = document.createElement( "div" );
        this.container.id = "scrum-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML        = authenticationViewTemplate;

        this.teamsContainer             = document.getElementById( "scrum-teams-container" );
        this.notesContainer             = document.getElementById( "scrum-notes-container" );
        this.welcomeScreenContainer     = document.getElementById( "scrum-welcome-screen-container" );
        this.createTeamContainer        = document.getElementById( "scrum-create-team-container" );
        this.mangeTeamsContainer        = document.getElementById( "scrum-manage-teams-container" );

        this.teams                      = new ScrumTeams( this, this.teamsContainer );
        this.notes                      = new ScrumNotes( this, this.notesContainer );
        this.welcomeScreen              = new ScrumWelcomeScreen( this, this.welcomeScreenContainer );
        this.createTeam                 = new ScrumCreateTeam( this, this.createTeamContainer );
        this.manageTeams                = new ScrumManageTeams( this, this.mangeTeamsContainer );



        this.enterScene();
    }



    public enterScene(): void {


    }



    public exitScene( exitType: string, callback: Function ): void {

        this.exitCallback = callback;

        this.teams.exitScene( exitType );
        this.notes.exitScene( exitType );
        this.welcomeScreen.exitScene( exitType );
        this.createTeam.exitScene( exitType );
        this.manageTeams.exitScene( exitType );
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

            case ScrumSignals.CREATE_TEAM :

                this.createTeam.enterScene( ViewEnterTypes.REVEAL_COMPONENT );

                break;

            case ScrumSignals.TEAM_SETTINGS :

                this.manageTeams.enterScene( ViewEnterTypes.REVEAL_COMPONENT );

                break;

            case ScrumSignals.SWITCH_WELCOME_SCREEN_TO_NOTES :

                this.notes.enterScene( ViewEnterTypes.REVEAL_COMPONENT );

                break;

            case ScrumSignals.LOAD_MEMBER_NOTES :

                ( this.notes as ScrumNotes ).loadMemberNotes( signal.data );

                break;

            case ScrumSignals.TEAM_UPDATED :

                ( this.teams as ScrumTeams ).teamUpdated( signal.data );

                break;

            case ScrumSignals.TEAM_CREATED :

                ( this.teams as ScrumTeams ).addTeam( signal.data );

                break;

            case ScrumSignals.MEMBER_ADDED :

                const { member, team } = signal.data;

                ( this.teams as ScrumTeams ).addMember( member, team );

                break;


            case ScrumSignals.MEMBER_UPDATED :

                const { memberId, name } = signal.data;

                ( this.teams as ScrumTeams ).updateMember( memberId, name );

                break;

            default:
                break;
        }
    }

}
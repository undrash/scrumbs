
import {SystemConstants} from "../../../core/SystemConstants";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ImpedimentsUnsolved} from "./ImpedimentsUnsolved";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewNotifications} from "../ViewNotifications";
import {ImpedimentsSolved} from "./ImpedimentsSolved";
import {ImpedimentsHeader} from "./ImpedimentsHeader";
import {ImpedimentSignals} from "./ImpedimentSignals";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";

declare const SimpleBar: any;

// CSS
import "../../../style/style-sheets/impediments-view.scss";


// HTML
const impedimentsViewTemplate = require( "../../../templates/impediments-view.html" );






export class ImpedimentsView extends View {

    private impedimentsContainer: HTMLElement;

    private impedimentsHeader: ViewComponent;
    private impedimentsHeaderContainer: HTMLElement;

    private impedimentsSolved: ViewComponent;
    private impedimentsSolvedContainer: HTMLElement;

    private impedimentsUnsolved: ViewComponent;
    private impedimentsUnsolvedContainer: HTMLElement;

    private impedimentsEmptyState: HTMLElement;
    private isImpedimensSolvedEmpty: boolean;
    private isImpedimentsUnsolvedEmpty: boolean;

    private createImpedimentBtn: HTMLElement;


    constructor() {
        super( "ImpedimentsView" );

        this.container = document.createElement( "div" );
        this.container.id = "impediments-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML                    = impedimentsViewTemplate;

        this.impedimentsContainer                   = document.getElementById( "impediments-container" );

        new SimpleBar( this.impedimentsContainer );

        this.impedimentsEmptyState                  = document.getElementById( "impediment-empty-state" );

        this.impedimentsHeaderContainer             = document.getElementById( "impediments-header-container" );
        this.impedimentsUnsolvedContainer           = document.getElementById( "impediments-unsolved-container" );
        this.impedimentsSolvedContainer             = document.getElementById( "impediments-solved-container" );

        this.impedimentsHeader                      = new ImpedimentsHeader( this, this.impedimentsHeaderContainer );
        this.impedimentsUnsolved                    = new ImpedimentsUnsolved( this, this.impedimentsUnsolvedContainer );
        this.impedimentsSolved                      = new ImpedimentsSolved( this, this.impedimentsSolvedContainer );

        this.createImpedimentBtn                    = document.getElementById( "create-impediment-btn" );

        this.createImpedimentListener               = this.createImpedimentListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.createImpedimentBtn.addEventListener( "click", this.createImpedimentListener );
    }



    private unregisterEventListeners(): void {
        this.createImpedimentBtn.removeEventListener( "click", this.createImpedimentListener );
    }



    private createImpedimentListener(): void {
        this.sendNotification( ViewNotifications.SWITCH_TO_CREATE_IMPEDIMENT_VIEW );
    }



    public enterScene(): void {
        this.registerEventListeners();
    }



    public exitScene( exitType: string, callback: Function ): void {
        this.unregisterEventListeners();

        this.exitCallback = callback;

        this.impedimentsHeader.exitScene( exitType );
        this.impedimentsSolved.exitScene( exitType );
        this.impedimentsUnsolved.exitScene( exitType );
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



    private displayEmptyState(): void {

        if ( this.isImpedimensSolvedEmpty && this.isImpedimentsUnsolvedEmpty ) {
            this.impedimentsEmptyState.style.display = "block";
        }
    }



    private hideEmptyState(): void {
        this.impedimentsEmptyState.style.display    = "none";
        this.isImpedimensSolvedEmpty                = false;
        this.isImpedimentsUnsolvedEmpty             = false;
    }



    public handleSignal(signal: ISignal) {
        console.log( "Signal received in " + this.NAME + ": " + signal.name );

        switch ( signal.name ) {

            case ImpedimentSignals.IMPEDIMENT_SOLVED :

                ( this.impedimentsSolved as ImpedimentsSolved ).addImpediment( signal.data );

                break;

            case ImpedimentSignals.IMPEDIMENT_UNSOLVED :

                ( this.impedimentsUnsolved as ImpedimentsUnsolved ).addImpediment( signal.data );

                break;

            case ImpedimentSignals.FILTER_IMPEDIMENTS :

                this.hideEmptyState();

                ( this.impedimentsSolved as ImpedimentsSolved ).populateFiltered( signal.data );
                ( this.impedimentsUnsolved as ImpedimentsUnsolved ).populateFiltered( signal.data );

                break;

            case ImpedimentSignals.IMPEDIMENTS_SOLVED_EMPTY :

                this.isImpedimensSolvedEmpty = true;

                this.displayEmptyState();

                break;

            case ImpedimentSignals.IMPEDIMENTS_UNSOLVED_EMPTY :

                this.isImpedimentsUnsolvedEmpty = true;

                this.displayEmptyState();

                break;

            case ImpedimentSignals.LOAD_ALL_IMPEDIMENTS :

                this.hideEmptyState();

                ( this.impedimentsSolved as ImpedimentsSolved ).populate();
                ( this.impedimentsUnsolved as ImpedimentsUnsolved ).populate();

                break;

            case ImpedimentSignals.SOLVE_ALL_IMPEDIMENTS :

                ( this.impedimentsUnsolved as ImpedimentsUnsolved ).solveAll();

                break;

            case ImpedimentSignals.CLEAR_SOLVED_IMPEDIMENTS :

                ( this.impedimentsSolved as ImpedimentsSolved ).clearImpediments();

                break;

            default:
                break;
        }
    }

}



import {ImpedimentsUnsolved} from "./ImpedimentsUnsolved";
import {SystemConstants} from "../../../core/SystemConstants";
import {ImpedimentsSolved} from "./ImpedimentsSolved";
import {ImpedimentsHeader} from "./ImpedimentsHeader";
import {ImpedimentSignals} from "./ImpedimentSignals";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {INotification} from "../../../core/INotification";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ISignal} from "../../../core/ISignal";
import {View} from "../../../core/View";


// CSS
import "../../../style/style-sheets/impediments-view.scss";


// HTML
const impedimentsViewTemplate = require( "../templates/impediments/view/impediments-view.html" );






export class ImpedimentsView extends View {
    private impedimentsHeader: ViewComponent;
    private impedimentsHeaderContainer: HTMLElement;

    private impedimentsSolved: ViewComponent;
    private impedimentsSolvedContainer: HTMLElement;

    private impedimentsUnsolved: ViewComponent;
    private impedimentsUnsolvedContainer: HTMLElement;




    constructor() {
        super( "ImpedimentsView" );

        this.container = document.createElement( "div" );
        this.container.id = "impediments-view-container";

        document.getElementById( SystemConstants.MAIN_CONTAINER ).appendChild( this.container );

        this.container.innerHTML                    = impedimentsViewTemplate;

        this.impedimentsHeaderContainer             = document.getElementById( "impediments-header-container" );
        this.impedimentsUnsolvedContainer           = document.getElementById( "impediments-unsolved-container" );
        this.impedimentsSolvedContainer             = document.getElementById( "impediments-solved-container" );

        this.impedimentsHeader                      = new ImpedimentsHeader( this, this.impedimentsHeaderContainer );
        this.impedimentsUnsolved                    = new ImpedimentsUnsolved( this, this.impedimentsUnsolvedContainer );
        this.impedimentsSolved                      = new ImpedimentsSolved( this, this.impedimentsSolvedContainer );



        this.enterScene();
    }



    public enterScene(): void {


    }



    public exitScene( exitType: string, callback: Function ): void {

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

                ( this.impedimentsSolved as ImpedimentsSolved ).populateFiltered( signal.data );
                ( this.impedimentsUnsolved as ImpedimentsUnsolved ).populateFiltered( signal.data );

                break;

            default:
                break;
        }
    }

}
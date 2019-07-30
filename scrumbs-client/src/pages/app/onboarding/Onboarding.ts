
import {TipImpedimentCheckbox} from "./guides/TipImpedimentCheckbox";
import {TipImpedimentShortcut} from "./guides/TipImpedimentShortcut";
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {TipEditMemberName} from "./guides/TipEditMemberName";
import {TipMemberOptions} from "./guides/TipMemberOptions";
import {OnboardingSignals} from "./OnboardingSignals";
import {ModalWelcome} from "./guides/ModalWelcome";
import {TipNewMember} from "./guides/TipNewMember";
import {ISignal} from "../../../core/ISignal";
import {Guide} from "./guides/Guide";
import {Guides} from "./Guides";
import {Flows} from "./Flows";

// CSS
import "../../../style/style-sheets/onboarding.scss"




export class Onboarding {
    private displayed: number[];

    private flows: any;

    private activeGuides: Guide[];

    private connection: ConnectionProxy;

    private testing: boolean;

    private timeout: any;

    constructor() {

        this.testing = true;

        this.connection = new ConnectionProxy( "Onboarding" );

        this.displayed = [];

        this.flows = {
            [ Flows.WELCOME ] : [
                { id: Guides.MODAL_WELCOME, ctor : ModalWelcome },
                { id: Guides.TIP_NEW_MEMBER, ctor: TipNewMember }
            ],
            [ Flows.MEMBER_EDIT ] : [
                { id: Guides.TIP_EDIT_MEMBER_NAME, ctor: TipEditMemberName },
                { id: Guides.TIP_MEMBER_OPTIONS, ctor: TipMemberOptions }
            ],
            [ Flows.IMPEDIMENTS_FEATURE ] : [
                { id: Guides.TIP_IMPEDIMENT_CHECKBOX, ctor: TipImpedimentCheckbox },
                { id: Guides.TIP_IMPEDIMENT_SHORTCUT, ctor: TipImpedimentShortcut }
            ]
        };


        this.activeGuides = [];
    }



    public initFlow(flow: Flows): any {

        this.clearGuides();

        for ( let guide of this.flows[ flow ] ) {

            if ( this.testing || this.displayed.indexOf( guide.id ) === -1 ) {

                if ( this.timeout ) clearTimeout( this.timeout );

                return this.timeout = setTimeout( () => {

                    this.guideDisplayed( guide.id );

                    this.activeGuides.push( new guide.ctor( this ) );
                }, 1500 );
            }
        }

    }



    public setGuidesDisplayed(displayed: number[]): void {
        if ( displayed ) this.displayed = displayed;
    }



    private switchGuide(guideId: number, toPrevious?: boolean): any {

        for ( let flow in this.flows ) {

            if ( this.flows.hasOwnProperty( flow ) ) {

                for ( let i = 0; i < this.flows[ flow ].length; i++ ) {

                    if ( this.flows[ flow ][ i ].id === guideId ) {

                        if ( toPrevious && i > 0 ) {

                            this.guideDisplayed( this.flows[ flow ][ i - 1 ].id );

                            return this.activeGuides.push(
                                new this.flows[ flow ][ i - 1 ].ctor( this )
                            );
                        }

                        if ( ! toPrevious && i < this.flows[ flow ].length - 1 ) {

                            this.guideDisplayed( this.flows[ flow ][ i + 1 ].id );

                            return this.activeGuides.push(
                                new this.flows[ flow ][ i + 1 ].ctor( this )
                            );
                        }
                    }
                }
            }
        }
    }



    public clearGuides(): void {

        for ( let guide of this.activeGuides ) {
            guide.exitScene();
        }
    }



    public destroyGuide(guideId: number): void {
        this.activeGuides = this.activeGuides.filter( g => g.id !== guideId );
    }



    public guideDisplayed(guideId: number): void {
        this.displayed.push( guideId );

        this.connection.onboardingGuideDisplayed(
            guideId,
            (resp: any) => console.log( resp ),
            (err: Error) => console.error( err )
        )
    }


    public handleSignal(signal: ISignal): void {

        switch ( signal.name ) {

            case OnboardingSignals.INIT_NEXT_GUIDE :

                this.switchGuide( signal.data );

                break;

            case OnboardingSignals.INIT_PREVIOUS_GUIDE :

                this.switchGuide( signal.data, true );

                break;

            default :
                break;
        }
    }

}

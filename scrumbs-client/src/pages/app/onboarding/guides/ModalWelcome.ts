
import {GuideSwitchType} from "../GuideSwitchType";
import {Onboarding} from "../Onboarding";
import {Guides} from "../Guides";
import {Guide} from "./Guide";


const template = require( "../../../../templates/onboarding-modal-welcome.html" );





export class ModalWelcome extends Guide {
    private overlay: HTMLElement;
    private closeBtn: HTMLElement;
    private startExploringBtn: HTMLElement;



    constructor(parent: Onboarding) {
        super( parent, Guides.MODAL_WELCOME, template );

        this.overlay            = this.container.querySelector( ".onboarding-modal-overlay" ) as HTMLElement;
        this.closeBtn           = this.container.querySelector( ".onboarding-close-btn" ) as HTMLElement;
        this.startExploringBtn  = this.container.querySelector( ".guide-primary-btn" ) as HTMLElement;

        this.actionListener     = this.actionListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.container.addEventListener( "click", this.actionListener );
    }



    private unregisterEventListeners(): void {
        this.container.removeEventListener( "click", this.actionListener );
    }



    private actionListener(e: any): void {

        switch ( e.target.className ) {

            case this.overlay.className :
                this.exitScene( GuideSwitchType.NEXT );
                break;

            case this.closeBtn.className :
                this.exitScene( GuideSwitchType.NEXT );
                break;

            case this.startExploringBtn.className :
                this.exitScene( GuideSwitchType.NEXT );
                break;

            default :
                break;
        }
    }



    protected enterScene(): void {
        super.enterScene();
        this.registerEventListeners();

        // TODO: Maybe some animation here
    }



    public exitScene(switchType?: GuideSwitchType): void {

        // TODO: Some animation could go here
        this.unregisterEventListeners();
        super.exitScene( switchType );
    }

}

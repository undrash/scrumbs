
import {GuideSwitchType} from "../GuideSwitchType";
import {Onboarding} from "../Onboarding";
import {Guides} from "../Guides";
import {Guide} from "./Guide";

import TweenLite = gsap.TweenLite;

const template = require( "../../../../templates/onboarding-modal-welcome.html" );





export class ModalWelcome extends Guide {
    private overlay: HTMLElement;
    private closeBtn: HTMLElement;
    private startExploringBtn: HTMLElement;

    private modal: HTMLElement;



    constructor(parent: Onboarding) {
        super( parent, Guides.MODAL_WELCOME, template );

        this.overlay            = this.container.querySelector( ".onboarding-modal-overlay" ) as HTMLElement;
        this.closeBtn           = this.container.querySelector( ".onboarding-close-btn" ) as HTMLElement;
        this.startExploringBtn  = this.container.querySelector( ".guide-primary-btn" ) as HTMLElement;
        this.modal              = this.container.querySelector( ".onboarding-modal-welcome" ) as HTMLElement;

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

        TweenLite.from( this.overlay, 0.5, { opacity: 0 } );

        TweenLite.from( this.modal,
            0.5,
            {
                marginTop: 300,
                opacity: 0
            });
    }



    public exitScene(switchType?: GuideSwitchType): void {

        TweenLite.to( this.overlay, 0.4, { opacity: 0, onComplete: () => {
            this.unregisterEventListeners();
            super.exitScene( switchType );
        }});

        TweenLite.to( this.modal,
            0.3,
            {
                marginTop: 300,
                opacity: 0
            });
    }

}

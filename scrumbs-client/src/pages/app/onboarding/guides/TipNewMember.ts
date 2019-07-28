

import {HTMLHelper} from "../../../../helpers/HTMLHelper";
import {GuideSwitchType} from "../GuideSwitchType";
import {Onboarding} from "../Onboarding";
import {Guides} from "../Guides";
import {Guide} from "./Guide";

const template = require( "../../../../templates/onboarding-tip-new-member.html" );





export class TipNewMember extends Guide {
    private target: HTMLElement;

    private closeBtn: HTMLElement;
    private gotItBtn: HTMLElement;

    private guide: HTMLElement;


    constructor(parent: Onboarding) {
        super( parent, Guides.TIP_NEW_MEMBER, template );

        this.guide              = this.container.firstElementChild as HTMLElement;

        this.target             = document.querySelector( ".scrum-create-member-btn" ) as HTMLElement;

        this.closeBtn           = this.container.querySelector( ".onboarding-close-btn" ) as HTMLElement;
        this.gotItBtn           = this.container.querySelector( ".guide-primary-btn" ) as HTMLElement;

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

            case this.closeBtn.className :
                this.exitScene( GuideSwitchType.NEXT );
                break;

            case this.gotItBtn.className :
                this.exitScene( GuideSwitchType.NEXT );
                break;

            default :
                break;
        }
    }



    private setPosition(): void {
        if ( ! this.target ) return;

        const position      = HTMLHelper.getOffset( this.target );

        const offsetX       = 42;
        const offsetY       = this.container.firstElementChild.clientHeight / 2 - 3;

        this.guide.style.left   = `${ position.left + offsetX }px`;
        this.guide.style.top    = `${ position.top - offsetY }px`;
    }



    protected enterScene(): void {
        super.enterScene();
        this.setPosition();
        this.registerEventListeners();

        setTimeout( () => { this.guide.style.opacity = '1' }, 1500 );
    }



    public exitScene(switchType?: GuideSwitchType): void {

        // TODO: Some animation could go here
        this.unregisterEventListeners();
        super.exitScene( switchType );
    }

}

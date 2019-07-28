

import {HTMLHelper} from "../../../../helpers/HTMLHelper";
import {Onboarding} from "../Onboarding";
import {Guides} from "../Guides";
import {Guide} from "./Guide";
import {GuideSwitchType} from "../GuideSwitchType";

const template = require( "../../../../templates/onboarding-tip-edit-member-name.html" );





export class TipEditMemberName extends Guide {
    private target: HTMLElement;

    private closeBtn: HTMLElement;
    private gotItBtn: HTMLElement;
    private skipBtn: HTMLElement;

    private guide: HTMLElement;



    constructor(parent: Onboarding) {
        super( parent, Guides.TIP_EDIT_MEMBER_NAME, template );

        this.guide              = this.container.firstElementChild as HTMLElement;

        this.target             = document.querySelector( "#scrum-notes-member-name" ) as HTMLElement;

        this.closeBtn           = this.container.querySelector( ".onboarding-close-btn" ) as HTMLElement;
        this.gotItBtn           = this.container.querySelector( ".guide-primary-btn" ) as HTMLElement;
        this.skipBtn            = this.container.querySelector( ".skip-link-btn" ) as HTMLElement;

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

            case this.skipBtn.className :
                this.exitScene();
                break;

            default :
                break;
        }
    }



    private setPosition(): void {

        if ( ! this.target ) return;

        const position      = HTMLHelper.getOffset( this.target );

        const offsetX       = this.target.offsetWidth + 30;
        const offsetY       = this.container.firstElementChild.clientHeight / 2 - 8;

        this.guide.style.left   = `${ position.left + offsetX }px`;
        this.guide.style.top    = `${ position.top - offsetY }px`;
    }



    protected enterScene(): void {
        super.enterScene();
        this.setPosition();
        this.registerEventListeners();

        setTimeout( () => { this.guide.style.opacity = '1' }, 100 );
    }



    public exitScene(switchType?: GuideSwitchType): void {

        // TODO: Some animation could go here
        this.unregisterEventListeners();
        super.exitScene( switchType );
    }

}

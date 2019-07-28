
import {ConnectionProxy} from "../../../../connection/ConnectionProxy";
import {OnboardingSignals} from "../OnboardingSignals";
import {GuideSwitchType} from "../GuideSwitchType";
import {Onboarding} from "../Onboarding";




export class Guide {
    protected parent: Onboarding;

    public id: number;
    protected container: HTMLElement;

    protected connection: ConnectionProxy;



    constructor(parent: Onboarding, id: number, template: string) {
        this.parent                 = parent;
        this.id                     = id;
        this.container              = document.createElement( "div" );
        this.container.className    = `onboarding-guide-${ this.id }`;
        this.container.innerHTML    = template;

        this.connection             = new ConnectionProxy( `Guide${ this.id }Proxy` );
    }



    protected sendSignal(name: string, data?: any, sender?: any): void {
        this.parent.handleSignal( { name, data, sender } );
    }



    protected enterScene(): void {
        document.body.appendChild( this.container );
    }



    public exitScene(switchType?: GuideSwitchType): void {

        this.container.parentNode.removeChild( this.container );
        this.parent.destroyGuide( this.id );

        if ( switchType === GuideSwitchType.NEXT ) this.sendSignal( OnboardingSignals.INIT_NEXT_GUIDE, this.id );
        if ( switchType === GuideSwitchType.PREVIOUS ) this.sendSignal( OnboardingSignals.INIT_PREVIOUS_GUIDE, this.id );
    }
}


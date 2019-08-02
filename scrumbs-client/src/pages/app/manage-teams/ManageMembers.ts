
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;




// HTML
const template = require( "../../../templates/manage-members.html" );






export class ManageMembers extends ViewComponent {




    constructor(view: View, container: HTMLElement) {
        super( view, container, "ManageMembers" );

        this.container.parentNode.removeChild( this.container );

        this.container.innerHTML = template;

    }



    private registerEventListeners(): void {

    }



    private unregisterEventListeners(): void {

    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in manage members" );
        this.registerEventListeners();

        switch ( enterType ) {

            case ViewEnterTypes.SWITCH_COMPONENT :
                this.view.container.appendChild( this.container );
                break;

            default :
                break;
        }

    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in manage members" );

        this.unregisterEventListeners();

        switch ( exitType ) {
            case ViewExitTypes.SWITCH_COMPONENT :

                if ( this.container.parentNode ) {
                    this.container.parentNode.removeChild( this.container );
                }

                break;

            default :
                super.exitScene( exitType );
                this.view.componentExited( this.name );
                break;
        }
    }
}
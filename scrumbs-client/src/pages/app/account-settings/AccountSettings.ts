
import {CreateTeamModel} from "../../../connection/models/CreateTeamModel";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;





// HTML
const template = require( "../../../templates/account-settings.html" );






export class AccountSettings extends ViewComponent {



    constructor(view: View, container: HTMLElement) {
        super( view, container, "AccountSettings" );

        this.container.innerHTML = template;


        this.enterScene();
    }



    private registerEventListeners(): void {}



    private unregisterEventListeners(): void {}



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in account settings view component" );

        this.registerEventListeners();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in account settings view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }

}

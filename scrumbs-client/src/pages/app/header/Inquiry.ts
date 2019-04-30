

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;



// CSS
import "../../../style/style-sheets/header-inquiry.scss";

// HTML
const template = require( "../../../templates/header-inquiry.html" );






export class Inquiry extends ViewComponent {




    constructor(view: View, container: HTMLElement) {
        super( view, container, "Inquiry" );

        this.container.innerHTML = template;


    }



    private registerEventListeners(): void {

    }



    private unregisterEventListeners(): void {

    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in view component" );
        this.registerEventListeners();
        this.container.style.display = "block";
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }
}
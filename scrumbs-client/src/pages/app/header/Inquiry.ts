

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
    private overlay: HTMLElement;

    private submitContainer: HTMLElement;
    private successContainer: HTMLElement;
    private failureContainer: HTMLElement;

    private closeBtn: HTMLElement;
    private submitBtn: HTMLElement;

    private select: HTMLElement;
    private selectText: HTMLElement;
    private selectArrow: HTMLElement;

    private dropdown: HTMLElement;
    private optionBug: HTMLElement;
    private optionRequest: HTMLElement;

    private titleInput: HTMLElement;
    private descriptionInput: HTMLElement;





    constructor(view: View, container: HTMLElement) {
        super( view, container, "Inquiry" );

        this.container.innerHTML    = template;

        this.overlay                = document.getElementById( "inquiry-overlay" );

        this.submitContainer        = document.getElementById( "inquiry-submit-container" );
        this.successContainer       = document.getElementById( "inquiry-failed-container" );
        this.failureContainer       = document.getElementById( "inquiry-success-container" );

        this.closeBtn               = document.getElementById( "inquiry-modal-close-btn" );
        this.submitBtn              = document.getElementById( "inquiry-submit-btn" );

        this.select                 = document.getElementById( "inquiry-select-dropdown-head" );
        this.selectText             = document.getElementById( "inquiry-selected" );
        this.selectArrow            = document.getElementById( "inquiry-dropdown-btn" );

        this.dropdown               = document.getElementById( "inquiry-select-dropdown-body" );
        this.optionBug              = document.getElementById( "inquiry-option-bug" );
        this.optionRequest          = document.getElementById( "inquiry-option-feature" );
        
        this.titleInput             = document.getElementById( "inquiry-modal-title-input" );
        this.descriptionInput       = document.getElementById( "inquiry-modal-description-input" );



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

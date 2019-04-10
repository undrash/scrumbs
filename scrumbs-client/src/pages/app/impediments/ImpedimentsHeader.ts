

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;


declare const SimpleBar: any;

// CSS
import "../../../style/style-sheets/impediments-header.scss";


// HTML
const template = require( "../templates/impediments/component/impediments-header.html" );






export class ImpedimentsHeader extends ViewComponent {

    private filterBtn: HTMLElement;

    private filterSearch: HTMLInputElement;
    private filterDropdownHeader: HTMLElement;
    private filterDropdown: HTMLElement;

    private filterMemberListMainContainer: HTMLElement;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "ImpedimentsHeader" );

        this.container.innerHTML    = template;

        this.filterBtn              = document.getElementById( "impediments-filter-button" );
        this.filterSearch           = document.getElementById( "impediments-filter-input" ) as HTMLInputElement;
        this.filterDropdownHeader   = document.getElementById( "impediments-filter-dropdown-header" );
        this.filterDropdown         = document.getElementById( "impediments-filter-dropdown" );

        this.filterMemberListMainContainer = document.getElementById( "impediments-filter-dropdown-member-list" );

        new SimpleBar( this.filterMemberListMainContainer );

        this.filterBtnListener      = this.filterBtnListener.bind( this );
        this.documentClickListener  = this.documentClickListener.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {
        this.filterBtn.addEventListener( "click", this.filterBtnListener );

        document.addEventListener( "click", this.documentClickListener );
    }



    private unregisterEventListeners(): void {
        this.filterBtn.removeEventListener( "click", this.filterBtnListener );

        document.removeEventListener( "click", this.documentClickListener );
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in impediments header view component" );
        this.registerEventListeners();
    }



    private filterBtnListener(): void {
        this.filterDropdown.style.display = "block";
    }



    private documentClickListener(e: any): void {

        if ( e.target.id !== this.filterBtn.id &&
             e.target.id !== this.filterSearch.id &&
             e.target.id !== this.filterDropdownHeader.id
        ) {
            this.filterDropdown.style.display = "none";
        }

    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in impediments header view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }
}
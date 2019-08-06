

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {SnackBarType} from "../../../common/SnackBarType";
import {ImpedimentSignals} from "./ImpedimentSignals";
import {View} from "../../../core/View";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;


declare const SimpleBar: any;

// CSS
import "../../../style/style-sheets/impediments-header.scss";
import Timeout = NodeJS.Timeout;


// HTML
const template = require( "../../../templates/impediments-header.html" );






export class ImpedimentsHeader extends ViewComponent {

    private filterBtn: HTMLElement;

    private filterSearch: HTMLInputElement;
    private filterDropdownHeader: HTMLElement;
    private filterDropdown: HTMLElement;
    private filterReset: HTMLElement;
    private filterYourImpediments: HTMLElement;

    private filterMemberListMainContainer: HTMLElement;
    private filterMemberListContainer: HTMLElement;

    private filterSearchTimer: Timeout;

    private optionsBtn: HTMLElement;
    private optionsDropdown: HTMLElement;

    private optionExport: HTMLElement;
    private optionSolveAll: HTMLElement;
    private optionClearSolved: HTMLElement;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "ImpedimentsHeader" );

        this.container.innerHTML    = template;

        this.filterBtn              = document.getElementById( "impediments-filter-button" );
        this.filterSearch           = document.getElementById( "impediments-filter-input" ) as HTMLInputElement;
        this.filterDropdownHeader   = document.getElementById( "impediments-filter-dropdown-header" );
        this.filterDropdown         = document.getElementById( "impediments-filter-dropdown" );
        this.filterReset            = document.getElementById( "impediments-filter-reset" );
        this.filterYourImpediments  = document.getElementById( "impediments-filter-user-impediments" );

        this.filterMemberListMainContainer = document.getElementById( "impediments-filter-dropdown-member-list" );

        new SimpleBar( this.filterMemberListMainContainer );

        this.filterMemberListContainer = this.filterMemberListMainContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLElement;

        this.optionsBtn             = document.getElementById( "impediments-header-options-button" );
        this.optionsDropdown        = document.getElementById( "impediments-header-options-dropdown" );
        this.optionExport           = document.getElementById( "impediment-option-export" );
        this.optionSolveAll         = document.getElementById( "impediment-option-solve-all" );
        this.optionClearSolved      = document.getElementById( "impediment-option-clear-solved" );


        this.filterBtnListener              = this.filterBtnListener.bind( this );
        this.documentClickListener          = this.documentClickListener.bind( this );
        this.filterSearchListener           = this.filterSearchListener.bind( this );
        this.filteredMemberSearch           = this.filteredMemberSearch.bind( this );
        this.filterResetListener            = this.filterResetListener.bind( this );
        this.optionsBtnListener             = this.optionsBtnListener.bind( this );
        this.optionsDropdownListener        = this.optionsDropdownListener.bind( this );
        this.filterYourImpedimentsListener  = this.filterYourImpedimentsListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.filterBtn.addEventListener( "click", this.filterBtnListener );
        this.filterSearch.addEventListener( "keyup", this.filterSearchListener );
        this.filterReset.addEventListener( "click", this.filterResetListener );
        this.filterYourImpediments.addEventListener( "click", this.filterYourImpedimentsListener );
        this.optionsBtn.addEventListener( "click", this.optionsBtnListener );
        this.optionsDropdown.addEventListener( "click", this.optionsDropdownListener );

        document.addEventListener( "click", this.documentClickListener );
    }



    private unregisterEventListeners(): void {
        this.filterBtn.removeEventListener( "click", this.filterBtnListener );
        this.filterSearch.removeEventListener( "keyup", this.filterSearchListener );
        this.filterReset.removeEventListener( "click", this.filterResetListener );
        this.filterYourImpediments.removeEventListener( "click", this.filterYourImpedimentsListener );
        this.optionsBtn.removeEventListener( "click", this.optionsBtnListener );
        this.optionsDropdown.removeEventListener( "click", this.optionsDropdownListener );

        document.removeEventListener( "click", this.documentClickListener );
    }



    private filterBtnListener(): void {
        this.filterDropdown.style.display = "block";
    }



    private filterSearchListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( this.filterSearchTimer ) clearTimeout( this.filterSearchTimer );


        if ( key === 13 ) { // ENTER

            if ( ! this.filterSearch.value ) {

                return this.populate();

            }

            this.filteredMemberSearch( { value: this.filterSearch.value } )

        } else {

            if ( this.filterSearch.value.length < 2 ) return;

            this.filterSearchTimer = setTimeout(
                this.filteredMemberSearch,
                250,
                {
                    value: this.filterSearch.value
                }
            );
        }
    }



    private filteredMemberSearch(data: any): void {
        const { value } = data;

        console.log( value );

        this.connection.searchMembers(
            value,
            (response: any) => {

                const { members } = response;

                this.populateFilterDropdownMembers( members );
            },
            (err: string) => console.error( err )
        );
    }



    private documentClickListener(e: any): void {

        /** Handle filter dropdown */

        if ( e.target.id !== this.filterBtn.id &&
            e.target.id !== this.filterSearch.id &&
            e.target.id !== this.filterDropdownHeader.id
        ) {
            this.filterDropdown.style.display = "none";
        }

        /** Handle options dropdown */

        if ( e.target.id !== this.optionsBtn.id ) {
            this.optionsDropdown.style.display = "none";
        }

    }



    private filterYourImpedimentsListener(): void {
        this.filterBtn.innerText = "Your Impediments";
        this.sendSignal( ImpedimentSignals.FILTER_IMPEDIMENTS, "user" );

    }


    private filterResetListener(): void {
        this.filterSearch.value = '';
        this.filterBtn.innerText = "All Impediments";
        this.sendSignal( ImpedimentSignals.LOAD_ALL_IMPEDIMENTS );

        this.populate();
    }



    private optionsBtnListener(): void {
        this.optionsDropdown.style.display = "block";
    }



    private optionsDropdownListener(e: any): void {

        switch ( e.target.id ) {

            case this.optionExport.id :
                this.snackbar.show( SnackBarType.WARNING, "Export feature coming soon" );
                break;

            case this.optionSolveAll.id :
                this.sendSignal( ImpedimentSignals.SOLVE_ALL_IMPEDIMENTS );
                break;

            case this.optionClearSolved.id :
                this.sendSignal( ImpedimentSignals.CLEAR_SOLVED_IMPEDIMENTS );
                break;

            default :
                break;
        }
    }



    private populateFilterDropdownMembers(members: any[]): void {
        this.filterMemberListContainer.innerHTML = '';

        for ( let member of members ) {
            this.addMemberToFilterDropdown( member );
        }
    }



    private addMemberToFilterDropdown(member: any): void {

        let memberElement           = document.createElement( "li" );
        memberElement.innerHTML     = this.highlightSearchString( member.name, this.filterSearch.value );
        memberElement.id            = member._id;

        memberElement.className     = "pointer noselect";

        this.filterMemberListContainer.appendChild( memberElement );

        memberElement.addEventListener( "click", this.filterMemberClickListener.bind( this ) );

    }



    private filterMemberClickListener(e: any): void {
        this.filterBtn.innerText = e.target.innerText;
        this.sendSignal( ImpedimentSignals.FILTER_IMPEDIMENTS, e.target.id );
    }



    private highlightSearchString(itemName: string, searchString:string): string {

        if ( ! searchString ) return itemName;

        const pattern = new RegExp( '(' + searchString + ')', "gi" );

        return itemName.replace( pattern, "<strong>$1</strong>" );
    }



    private populate(): void {

        this.filterMemberListContainer.innerHTML = '';

        this.connection.getMembers(
            (response: any) => {
                const { members } = response;

                this.populateFilterDropdownMembers( members );

            },
            (err: string) => console.error( err )
        );
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in impediments header view component" );
        this.registerEventListeners();
        this.populate();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in impediments header view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }
}
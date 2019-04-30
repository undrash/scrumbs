

import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ImpedimentSignals} from "./ImpedimentSignals";
import {View} from "../../../core/View";

import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;


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

    private filterMemberListMainContainer: HTMLElement;
    private filterMemberListContainer: HTMLElement;

    private filterSearchTimer: Timeout;




    constructor(view: View, container: HTMLElement) {
        super( view, container, "ImpedimentsHeader" );

        this.container.innerHTML    = template;

        this.filterBtn              = document.getElementById( "impediments-filter-button" );
        this.filterSearch           = document.getElementById( "impediments-filter-input" ) as HTMLInputElement;
        this.filterDropdownHeader   = document.getElementById( "impediments-filter-dropdown-header" );
        this.filterDropdown         = document.getElementById( "impediments-filter-dropdown" );

        this.filterMemberListMainContainer = document.getElementById( "impediments-filter-dropdown-member-list" );

        new SimpleBar( this.filterMemberListMainContainer );


        this.filterMemberListContainer = this.filterMemberListMainContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLElement;

        this.filterBtnListener      = this.filterBtnListener.bind( this );
        this.documentClickListener  = this.documentClickListener.bind( this );
        this.filterSearchListener   = this.filterSearchListener.bind( this );
        this.filteredMemberSearch   = this.filteredMemberSearch.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {
        this.filterBtn.addEventListener( "click", this.filterBtnListener );
        this.filterSearch.addEventListener( "keyup", this.filterSearchListener );

        document.addEventListener( "click", this.documentClickListener );
    }



    private unregisterEventListeners(): void {
        this.filterBtn.removeEventListener( "click", this.filterBtnListener );
        this.filterSearch.removeEventListener( "keyup", this.filterSearchListener );

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

        if ( e.target.id !== this.filterBtn.id &&
            e.target.id !== this.filterSearch.id &&
            e.target.id !== this.filterDropdownHeader.id
        ) {
            this.filterDropdown.style.display = "none";
        }

    }



    private populateFilterDropdownMembers(members: any[]): void {
        this.filterMemberListContainer.innerHTML = null;

        for ( let member of members ) {
            this.addMemberToFilterDropdown( member );
        }
    }



    private addMemberToFilterDropdown(member: any): void {

        let memberElement           = document.createElement( "li" );
        memberElement.innerText     = member.name;
        memberElement.id            = member._id;

        memberElement.className     = "pointer noselect";

        this.filterMemberListContainer.appendChild( memberElement );

        memberElement.addEventListener( "click", this.filterMemberClickListener.bind( this ) );

    }



    private filterMemberClickListener(e: any): void {
        this.filterBtn.innerText = e.target.innerText;
        this.sendSignal( ImpedimentSignals.FILTER_IMPEDIMENTS, e.target.id );
    }



    private populate(): void {

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

import {CreateTeamModel} from "../../../connection/models/CreateTeamModel";
import {CreateImpedimentSignals} from "./CreateImpedimentSignals";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;


declare const SimpleBar: any;

// CSS
import "../../../style/style-sheets/create-impediment.scss";
import {CreateNoteModel} from "../../../connection/models/CreateNoteModel";


// HTML
const template = require( "../../../templates/create-impediment.html" );






export class CreateImpediment extends ViewComponent {
    private exitBtn: HTMLElement;
    private saveBtn: HTMLElement;
    private input: HTMLInputElement;
    private inputError: HTMLElement;
    private searchMembers: HTMLInputElement;
    private clearSearch: HTMLElement;
    private emptyState: HTMLElement;
    private mainMemberList: HTMLElement;
    private memberList: HTMLElement;

    private selectedMember: string;

    private searchTimer: any;

    constructor(view: View, container: HTMLElement) {
        super( view, container, "CreateImpediment" );

        this.container.innerHTML = template;

        this.exitBtn = document.getElementById( "create-impediment-exit-button" );
        this.saveBtn = document.getElementById( "create-impediment-save-button" );
        this.input  = document.getElementById( "create-impediment-input" ) as HTMLInputElement;
        this.inputError = document.getElementById( "new-impediment-error-message" );
        this.searchMembers = document.getElementById( "create-impediment-member-search-input" ) as HTMLInputElement;
        this.clearSearch = document.getElementById( "create-impediment-clear-search" );
        this.emptyState = document.getElementById( "add-impediment-search-empty-state" );
        this.mainMemberList = document.getElementById( "add-impediment-members-list" );

        new SimpleBar( this.mainMemberList );

        this.memberList        = this.mainMemberList.getElementsByClassName( "simplebar-content" )[0] as HTMLDivElement;


        this.exitBtnHandler         = this.exitBtnHandler.bind( this );
        this.saveBtnHandler         = this.saveBtnHandler.bind( this );
        this.searchListener         = this.searchListener.bind( this );
        this.searchForMembers       = this.searchForMembers.bind( this );
        this.clearSearchHandler     = this.clearSearchHandler.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );

        this.selectedMember         = null;

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.exitBtn.addEventListener( "click", this.exitBtnHandler );
        this.saveBtn.addEventListener( "click", this.saveBtnHandler );
        this.searchMembers.addEventListener( "keyup", this.searchListener );
        this.clearSearch.addEventListener( "click", this.clearSearchHandler );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.exitBtn.removeEventListener( "click", this.exitBtnHandler );
        this.saveBtn.removeEventListener( "click", this.saveBtnHandler );
        this.searchMembers.removeEventListener( "keyup", this.searchListener );
        this.clearSearch.removeEventListener( "click", this.clearSearchHandler );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 13 ) this.saveBtnHandler(); // ENTER
        if ( key === 27 ) this.sendSignal( CreateImpedimentSignals.EXIT ); // ESCAPE

    }



    private exitBtnHandler() {
        this.sendSignal( CreateImpedimentSignals.EXIT );
    }



    private saveBtnHandler() {
        const name = this.input.value;

        if ( ! name ) return this.inputError.style.opacity = "1";

        const createNoteModel = new CreateNoteModel(
            this.selectedMember,
            null,
            this.input.value,
            true
        );

        this.connection.createNote(
            createNoteModel,
            (response: any) => {
                console.log( response );
                this.sendSignal( CreateImpedimentSignals.EXIT );
            },
            (err: Error) => console.error( err )
        );

    }



    private searchListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( this.searchTimer ) clearTimeout( this.searchTimer );

        if ( ! this.searchMembers.value ) {
            this.clearSearch.style.display = "none";
            return this.populate();

        } else {
            this.clearSearch.style.display = "block";
        }


        if ( key === 13 ) { // ENTER

            this.searchForMembers( this.searchMembers.value  )

        } else {

            if ( this.searchMembers.value.length < 2 ) return;

            this.searchTimer = setTimeout(
                this.searchForMembers,
                250,
                this.searchMembers.value
            );
        }

    }



    private clearSearchHandler(): void {
        this.searchMembers.value = null;
        this.clearSearch.style.display = "none";
        this.populate();
    }



    private addMember(memberData: any): void {

        const member        = document.createElement( "div" );
        member.id           = memberData._id;
        member.className    = "team-members-list-item";

        const name          = document.createElement( "p" );
        name.innerHTML      = this.highlightSearchString( memberData.name, this.searchMembers.value );

        const checkbox      = document.createElement( "div" );
        checkbox.className  = "checked-box";

        member.appendChild( name );
        member.appendChild( checkbox );

        this.memberList.insertBefore( member, this.memberList.firstChild );

        if ( this.selectedMember === member.id ) member.classList.add( "selected" );

        member.addEventListener( "click", () => {

            /** If the current member is selected */

            if ( member.classList.contains( "selected" ) ) {
                member.classList.remove( "selected" );
                return this.selectedMember = null;
            }

            /** If the current member was not selected */

            this.selectedMember = member.id;

            if ( this.memberList.querySelector( ".selected" ) ) {
                this.memberList.querySelector( ".selected" ).classList.remove( "selected" );
            }

            member.classList.add( "selected" );
        });
    }



    private highlightSearchString(itemName: string, searchString:string): string {

        if ( ! searchString ) return itemName;

        const pattern = new RegExp( '(' + searchString + ')', "gi" );

        return itemName.replace( pattern, "<strong>$1</strong>" );
    }



    private searchForMembers(value: string): void {

        this.connection.searchMembers(
            value,
            (response: any) => {

                const { members } = response;

                this.populateMembers( members );

            },
            (err: string) => console.error( err )
        );
    }



    private populateMembers(members: any): void {
        this.memberList.innerHTML = '';

        if ( ! members.length ) return this.showEmptyState();

        this.hideEmptyState();

        for ( let member of members ) {
            this.addMember( member );
        }
    }



    private populate(): void {
        this.connection.getMembers(
            (response: any) => {
                const { members } = response;

                this.populateMembers( members );
            },
            (err: string) => console.error( err )
        );
    }



    private showEmptyState(): void {
        this.mainMemberList.style.display  = "none";
        this.emptyState.style.display   = "block";
    }



    private hideEmptyState(): void {
        this.emptyState.style.display   = "none";
        this.mainMemberList.style.display  = "block";
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in scrum create team view component" );

        this.registerEventListeners();
        this.populate();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum create team view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }

}

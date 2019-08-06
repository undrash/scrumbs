
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {ManageTeams} from "./ManageTeams";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require("../../../templates/manage-teams-add-member-modal.html" );


declare const SimpleBar: any;


export class AddMemberModal {

    private container: HTMLElement;
    private component: ManageTeams;
    private connection: ConnectionProxy;

    private teamName: HTMLElement;
    private searchInput: HTMLInputElement;
    private clearSearch: HTMLElement;
    private emptyState: HTMLElement;
    private mainMemberContainer: HTMLElement;
    private memberContainer: HTMLElement;

    private overlay: HTMLElement;
    private modal: HTMLElement;
    private cancelBtn: HTMLElement;
    private saveBtn: HTMLElement;
    private closeBtn: HTMLElement;

    private searchTimer: any;

    private selectedMembers: string[];



    constructor(component: ManageTeams) {

        this.component              = component;
        this.connection             = new ConnectionProxy( "AddMemberModal" );

        this.container              = document.createElement( "div" );
        this.container.id           = "manage-teams-add-member-modal-container";

        this.container.innerHTML    = template;

        this.overlay                = this.container.querySelector( "#manage-teams-add-member-modal" ) as HTMLElement;
        this.modal                  = this.container.querySelector( ".modal-bg" ) as HTMLElement;
        this.teamName               = this.container.querySelector( "#add-member-modal-team-name" ) as HTMLElement;
        this.searchInput            = this.container.querySelector( "#add-member-modal-search-input" ) as HTMLInputElement;
        this.clearSearch            = this.container.querySelector( "#add-member-modal-clear-search" ) as HTMLInputElement;
        this.emptyState             = this.container.querySelector( "#add-member-modal-members-empty-state" ) as HTMLElement;

        this.mainMemberContainer    = this.container.querySelector( "#add-member-modal-member-list-container" ) as HTMLElement;

        new SimpleBar( this.mainMemberContainer );

        this.memberContainer        = this.mainMemberContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLElement;

        this.cancelBtn              = this.container.querySelector( "#manage-teams-add-member-modal-cancel-btn" ) as HTMLElement;
        this.saveBtn                = this.container.querySelector( "#manage-teams-add-member-modal-save-btn" ) as HTMLElement;
        this.closeBtn               = this.container.querySelector( "#manage-teams-add-member-modal-close-btn" ) as HTMLElement;

        this.resetAndExit           = this.resetAndExit.bind( this );
        this.searchListener         = this.searchListener.bind( this );
        this.searchForMembers       = this.searchForMembers.bind( this );
        this.saveListener           = this.saveListener.bind( this );
        this.clearSearchHandler     = this.clearSearchHandler.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );

        this.selectedMembers        = [];
    }



    private registerEventListeners(): void {
        this.saveBtn.addEventListener( "click", this.saveListener );
        this.closeBtn.addEventListener( "click", this.resetAndExit );
        this.cancelBtn.addEventListener( "click", this.resetAndExit );
        this.searchInput.addEventListener( "keyup", this.searchListener );
        this.clearSearch.addEventListener( "click", this.clearSearchHandler );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.saveBtn.removeEventListener( "click", this.saveListener );
        this.closeBtn.removeEventListener( "click", this.resetAndExit );
        this.cancelBtn.removeEventListener( "click", this.resetAndExit );
        this.searchInput.removeEventListener( "keyup", this.searchListener );
        this.clearSearch.removeEventListener( "click", this.clearSearchHandler );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.resetAndExit(); // ESCAPE
    }



    public resetAndExit(): void {
        this.selectedMembers            = [];
        this.searchInput.value          = '';
        this.teamName.innerText         = '';
        this.memberContainer.innerHTML  = '';

        this.exitScene();
    }



    public saveListener(): void {
        console.log( this.selectedMembers );
        this.component.addMembersToTeam( this.selectedMembers );
        this.resetAndExit();
    }



    private clearSearchHandler(): void {
        this.searchInput.value          = '';
        this.clearSearch.style.display  = "none";
        this.populate();
    }



    private searchListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( this.searchTimer ) clearTimeout( this.searchTimer );

        if ( ! this.searchInput.value ) {
            this.clearSearch.style.display = "none";
            return this.populate();

        } else {
            this.clearSearch.style.display = "block";
        }


        if ( key === 13 ) { // ENTER

            this.searchForMembers( this.searchInput.value  )

        } else {

            if ( this.searchInput.value.length < 2 ) return;

            this.searchTimer = setTimeout(
                this.searchForMembers,
                250,
                this.searchInput.value
            );
        }
    }



    private searchForMembers(value: string): void {
        console.log( value );

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

        const currentMembers = this.component.getCurrentMembersOfTeam();

        members = members.filter( (m: any) => currentMembers.indexOf( m._id ) === -1 );

        if ( ! members.length ) {
            return this.showEmptyState();
        }

        this.hideEmptyState();

        this.memberContainer.innerHTML = null;

        for ( let member of members ) {
            this.addMember( member );
        }
    }



    private addMember(memberData: any): void {

        let member          = document.createElement( "div" );
        member.className    = "team-members-list-item";
        member.id           = memberData._id;

        let name            = document.createElement( "p" );
        name.innerHTML      = this.highlightSearchString( memberData.name, this.searchInput.value );

        let checkbox        = document.createElement( "span" );
        checkbox.className  = "check-box";


        member.appendChild( name );
        member.appendChild( checkbox );

        this.memberContainer.insertBefore( member, this.memberContainer.firstChild );

        if ( this.selectedMembers.indexOf( member.id ) !== -1 ) checkbox.classList.add( "checked" );

        member.addEventListener( "click", () => {
            const memberId = member.id;

            if ( checkbox.classList.contains( "checked" ) ) {
                checkbox.classList.remove( "checked" );
                this.selectedMembers = this.selectedMembers.filter( id => id !== memberId );
            } else {
                checkbox.classList.add( "checked" );
                this.selectedMembers.push( memberId );
            }

        });

    }



    private highlightSearchString(itemName: string, searchString:string): string {

        if ( ! searchString ) return itemName;

        const pattern = new RegExp( '(' + searchString + ')', "gi" );

        return itemName.replace( pattern, "<strong>$1</strong>" );
    }



    private showEmptyState(): void {
        this.mainMemberContainer.style.display  = "none";
        this.emptyState.style.display           = "block";
    }



    private hideEmptyState(): void {
        this.emptyState.style.display           = "none";
        this.mainMemberContainer.style.display  = "block";
    }



    private populate(): void {
        this.teamName.innerText     = this.component.getCurrentlyLoadedTeamName();

        this.connection.getMembers(
            (response: any) => {
                const { members } = response;

                this.populateMembers( members );
            },
            (err: string) => console.error( err )
        );
    }



    public enterScene(): void {
        this.registerEventListeners();
        this.populate();

        document.body.appendChild( this.container );

        TweenLite.to( this.overlay, 0.15, { opacity: 1 } );

        TweenLite.to( this.modal,
            0.3,
            {
                opacity: 1
            });

        TweenLite.to( this.modal,
            0.2,
            {
                marginTop: 90,
                opacity: 1
            });
    }



    private exitScene(): void {
        this.unregisterEventListeners();
        TweenLite.to( this.overlay, 0.3, { opacity: 0 } );

        TweenLite.to( this.modal, 0.3, { opacity: 0 } );

        TweenLite.to( this.modal,
            0.2,
            {
                marginTop: 200,
                opacity: 0
            });

        setTimeout( () => {
            this.container.parentNode.removeChild( this.container );
        }, 300 );

        this.component.addMemberModalExited();
    }

}


import {CreateMemberModel} from "../../../connection/models/CreateMemberModel";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ManageTeamSignals} from "./ManageTeamSignals";
import {View} from "../../../core/View";
import {Member} from "./Member";


declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

declare const SimpleBar: any;


// HTML
const template          = require( "../../../templates/manage-members.html" );
const templateAddMember = require( "../../../templates/manage-members-member-add.html" );






export class ManageMembers extends ViewComponent {

    private contentContainer: HTMLElement;

    private memberSearch: HTMLInputElement;
    private clearSearch: HTMLElement;

    private filterBtn: HTMLElement;
    private filterDropdown: HTMLElement;
    private filterOptionAllMembers: HTMLElement;
    private filterOptionUncategorized: HTMLElement;
    private filterTeamsList: HTMLElement;

    private emptySearch: HTMLElement;

    private mainMemberList: HTMLElement;
    private memberList: HTMLElement;

    private searchTimer: any;

    private addMemberBtn: HTMLElement;

    private memberAdd: HTMLElement;
    private memberAddInput: HTMLInputElement;
    private memberAddSaveBtn: HTMLElement;
    private memberAddCancelBtn: HTMLElement;

    private emptyState: HTMLElement;
    private emptyStateCreateMemberBtn: HTMLElement;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "ManageMembers" );

        this.container.parentNode.removeChild( this.container );

        this.container.innerHTML            = template;

        this.contentContainer               = this.container.querySelector( "#manage-members-content-container" ) as HTMLElement;

        this.memberSearch                   = this.container.querySelector( "#manage-members-search-input" ) as HTMLInputElement;
        this.clearSearch                    = this.container.querySelector( "#manage-members-clear-input" ) as HTMLElement;
        this.filterBtn                      = this.container.querySelector( "#manage-members-filter-btn" ) as HTMLElement;
        this.filterDropdown                 = this.container.querySelector( "#manage-members-filter-dropdown" ) as HTMLElement;
        this.filterOptionAllMembers         = this.container.querySelector( "#manage-members-filter-option-all-members" ) as HTMLElement;
        this.filterOptionUncategorized      = this.container.querySelector( "#manage-members-filter-option-uncategorized" ) as HTMLElement;

        new SimpleBar( this.filterDropdown );

        this.filterTeamsList                = this.container.querySelector( "#manage-members-filter-team-list" ) as HTMLElement;
        this.emptySearch                    = this.container.querySelector( "#manage-member-empty-search-results" ) as HTMLElement;

        this.mainMemberList                 = this.container.querySelector( "#manage-members-members-list-container" ) as HTMLElement;

        new SimpleBar( this.mainMemberList );

        this.memberList                     = this.mainMemberList.getElementsByClassName( "simplebar-content" )[0] as HTMLElement;

        this.addMemberBtn                   = this.container.querySelector( "#manage-members-add-new-member-btn" ) as HTMLElement;

        this.memberAdd                      = document.createElement( "div" );
        this.memberAdd.id                   = "manage-members-members-list-item";
        this.memberAdd.innerHTML            = templateAddMember;

        this.memberAddInput                 = this.memberAdd.querySelector( ".edit-member-input" ) as HTMLInputElement;
        this.memberAddSaveBtn               = this.memberAdd.querySelector( ".member-add-save" ) as HTMLElement;
        this.memberAddCancelBtn             = this.memberAdd.querySelector( ".member-add-cancel" ) as HTMLElement;

        this.emptyState                     = this.container.querySelector( "#manage-members-empty-state-container" ) as HTMLElement;
        this.emptyStateCreateMemberBtn      = this.container.querySelector( "#manage-members-empty-state-add-new-team-btn" ) as HTMLElement;

        this.searchForMembers               = this.searchForMembers.bind( this );
        this.searchListener                 = this.searchListener.bind( this );
        this.clearSearchHandler             = this.clearSearchHandler.bind( this );
        this.filterClickHandler             = this.filterClickHandler.bind( this );
        this.documentClickHandler           = this.documentClickHandler.bind( this );
        this.filterDropdownClickHandler     = this.filterDropdownClickHandler.bind( this );
        this.addMemberListener              = this.addMemberListener.bind( this );
        this.addMemberKeyListener           = this.addMemberKeyListener.bind( this );
        this.addMemberSaveListener          = this.addMemberSaveListener.bind( this );
        this.addMemberCancelListener        = this.addMemberCancelListener.bind( this );

    }



    private registerEventListeners(): void {
        this.memberSearch.addEventListener( "keyup", this.searchListener );
        this.clearSearch.addEventListener( "click", this.clearSearchHandler );
        this.filterBtn.addEventListener( "click", this.filterClickHandler );
        this.filterDropdown.addEventListener( "click", this.filterDropdownClickHandler );
        this.addMemberBtn.addEventListener( "click", this.addMemberListener );
        this.emptyStateCreateMemberBtn.addEventListener( "click", this.addMemberListener );
        this.memberAdd.addEventListener( "keydown", this.addMemberKeyListener );
        this.memberAddSaveBtn.addEventListener( "click", this.addMemberSaveListener );
        this.memberAddCancelBtn.addEventListener( "click", this.addMemberCancelListener );
        document.addEventListener( "click", this.documentClickHandler );
    }



    private unregisterEventListeners(): void {
        this.memberSearch.removeEventListener( "keyup", this.searchListener );
        this.clearSearch.removeEventListener( "click", this.clearSearchHandler );
        this.filterBtn.removeEventListener( "click", this.filterClickHandler );
        this.filterDropdown.removeEventListener( "click", this.filterDropdownClickHandler );
        this.addMemberBtn.removeEventListener( "click", this.addMemberListener );
        this.emptyStateCreateMemberBtn.removeEventListener( "click", this.addMemberListener );
        this.memberAdd.removeEventListener( "keydown", this.addMemberKeyListener );
        this.memberAddSaveBtn.removeEventListener( "click", this.addMemberSaveListener );
        this.memberAddCancelBtn.removeEventListener( "click", this.addMemberCancelListener );
        document.removeEventListener( "click", this.documentClickHandler );
    }



    private addMemberListener(): void {
        this.enterAddMember();
    }



    private addMemberSaveListener(): void {
        this.createMember( this.memberAddInput.value );
        this.exitAddMember();
    }



    private addMemberCancelListener(): void {
        this.exitAddMember();
    }



    private addMemberKeyListener(e: any): void {

        const key = e.which || e.keyCode;

        if ( key === 27 ) { // ESC

            this.exitAddMember();

        } else if ( key === 13 ) { // ENTER

            this.createMember( this.memberAddInput.value );
            this.exitAddMember();
        }
    }



    private filterClickHandler(): void {
        this.filterDropdown.style.display = "block";
    }



    private filterDropdownClickHandler(e: any): void {

        this.filterBtn.innerText = e.target.innerText;

        switch ( e.target.id ) {

            case this.filterOptionAllMembers.id :
                this.populateMembers();
                break;

            case this.filterOptionUncategorized.id :

                this.connection.getUncategorizedMembers(
                    (response: any) => {
                        const { members } = response;
                        this.addMembers( members );
                    },
                    (err: Error) => console.error( err )
                );

                break;

            default :

                this.connection.getMembersOfTeam(
                    e.target.id,
                    (response: any) => {
                        const { members } = response;
                        this.addMembers( members );
                    },
                    (err: Error) => console.error( err )
                );
                break;
        }
    }



    private documentClickHandler(e: any): void {
        if ( e.target.id !== this.filterBtn.id ) this.filterDropdown.style.display = "none";
    }



    private clearSearchHandler(): void {
        this.memberSearch.value         = '';
        this.clearSearch.style.display  = "none";
        this.populateMembers();
    }



    private searchListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( this.searchTimer ) clearTimeout( this.searchTimer );

        if ( ! this.memberSearch.value ) {
            this.clearSearch.style.display = "none";
            return this.populateMembers();

        } else {
            this.clearSearch.style.display = "block";
        }


        if ( key === 13 ) { // ENTER

            this.searchForMembers( this.memberSearch.value  )

        } else {

            if ( this.memberSearch.value.length < 2 ) return;

            this.searchTimer = setTimeout(
                this.searchForMembers,
                250,
                this.memberSearch.value
            );
        }
    }



    private enterAddMember(): void {
        this.hideEmptyState();
        this.hideEmptySearchResults();
        this.sendSignal( ManageTeamSignals.FOREGROUND_ACTIVE );
        this.memberList.insertBefore( this.memberAdd, this.memberList.firstElementChild );
        this.memberAddInput.focus();
    }



    private exitAddMember(): void {
        this.memberList.removeChild( this.memberAdd );
        this.memberAddInput.value = '';
        setTimeout( () => this.sendSignal( ManageTeamSignals.FOREGROUND_INACTIVE ) , 0 );
    }



    private createMember(name: string): void {

        const createMemberModel = new CreateMemberModel( name, null );

        this.connection.createMember(
            createMemberModel,
            (response: any) => {
                console.log( response );

                const { member } = response;

                this.addMember( member );

            },
            (err: string) => console.error( err )
        );
    }



    private searchForMembers(value: string): void {

        this.connection.searchMembers(
            value,
            (response: any) => {
                const { members } = response;

                if ( ! members.length ) return this.showEmptySearchResults();

                this.hideEmptySearchResults();

                this.addMembers( members );

            },
            (err: string) => console.error( err )
        );
    }



    private resetComponent(): void {
        //TODO reset component
    }



    private addMember(memberData: any): void {
        new Member( this, memberData, this.memberList );
    }



    private addTeamToFilter(team: any): void {
        const filter        = document.createElement( "div" );
        filter.className    = "options-list-btn";
        filter.innerText    = team.name;
        filter.id           = team._id;

        this.filterTeamsList.appendChild( filter );
    }



    private addMembers(members: any[]): void {

        this.memberList.innerHTML = '';

        for ( let member of members ) {
            this.addMember( member );
        }
    }



    private showEmptySearchResults(): void {
        this.mainMemberList.style.display   = "none";
        this.emptySearch.style.display      = "block";
    }



    private hideEmptySearchResults(): void {
        this.emptySearch.style.display      = "none";
        this.mainMemberList.style.display   = "block";
    }



    private populateMembers(): void {

        this.connection.getMembers(
            (response: any) => {
                const { members } = response;

                if ( ! members.length ) return this.showEmptyState();

                this.hideEmptyState();
                this.hideEmptySearchResults();

                this.addMembers( members );
            },
            (err: Error) => console.error( err )
        );
    }



    private populateFilters(): void {

        this.connection.getTeams(
            (response: any) => {
                const { teams } = response;

                if ( teams.length ) this.filterTeamsList.innerHTML = '';

                for ( let team of teams ) {
                    this.addTeamToFilter( team );
                }
            },
            (err: Error) => console.error( err )
        );
    }



    private showEmptyState(): void {
        this.contentContainer.style.display     = "none";
        this.emptyState.style.display           = "block";
    }



    private hideEmptyState(): void {
        this.emptyState.style.display           = "none";
        this.contentContainer.style.display     = "block";
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in manage members" );
        this.registerEventListeners();
        this.populateMembers();
        this.populateFilters();


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
                    this.resetComponent();
                }

                break;

            default :
                super.exitScene( exitType );
                this.view.componentExited( this.name );
                break;
        }
    }
}


import {CreateTeamModel} from "../../../connection/models/CreateTeamModel";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {CreateTeamSignals} from "./CreateTeamSignals";
import {View} from "../../../core/View";


declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;


declare const SimpleBar: any;

// CSS
import "../../../style/style-sheets/create-team.scss";


// HTML
const template = require( "../../../templates/create-team.html" );






export class CreateTeam extends ViewComponent {
    private saveBtn: HTMLButtonElement;
    private exitBtn: HTMLSpanElement;
    private teamNameInput: HTMLInputElement;
    private mainMemberContainer: HTMLUListElement;
    private memberContainer: HTMLDivElement;
    private searchMembers: HTMLInputElement;
    private clearSearch: HTMLImageElement;

    private teamNameError: HTMLElement;

    private emptySearchResults: HTMLElement;

    private selectedMembers: string[];

    private searchTimer: any;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "CreateTeam" );

        this.container.innerHTML = template;

        this.saveBtn                = document.getElementById( "create-team-save-button" ) as HTMLButtonElement;
        this.exitBtn                = document.getElementById( "create-team-exit-button" ) as HTMLSpanElement;
        this.teamNameInput          = document.getElementById( "create-team-name-input" ) as HTMLInputElement;
        this.mainMemberContainer    = document.getElementById( "create-team-members-container" ) as HTMLUListElement;
        this.searchMembers          = document.getElementById( "create-team-member-search-input" ) as HTMLInputElement;
        this.clearSearch            = document.getElementById( "create-team-member-search-clear" ) as HTMLImageElement;
        this.emptySearchResults     = document.getElementById( "member-search-empty" );

        this.teamNameError          = document.getElementById( "scrum-create-team-name-error" );

        new SimpleBar( this.mainMemberContainer );

        this.memberContainer        = this.mainMemberContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLDivElement;


        this.exitBtnHandler         = this.exitBtnHandler.bind( this );
        this.saveBtnHandler         = this.saveBtnHandler.bind( this );
        this.searchListener         = this.searchListener.bind( this );
        this.searchForMembers       = this.searchForMembers.bind( this );
        this.clearSearchHandler     = this.clearSearchHandler.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );

        this.selectedMembers    = [];

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
        if ( key === 27 ) this.sendSignal( CreateTeamSignals.EXIT ); // ESCAPE
    }



    private exitBtnHandler() {
        this.sendSignal( CreateTeamSignals.EXIT );
    }



    private saveBtnHandler() {
        const name = this.teamNameInput.value;

        if ( ! name ) return this.teamNameError.style.display = "block";

        const createTeamModel = new CreateTeamModel( name, this.selectedMembers );

        this.connection.createTeam(
            createTeamModel,
            (response: any) => {
                console.log( response );

                this.sendSignal( CreateTeamSignals.EXIT );
            },
            (err: string) => console.error( err )
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

        const member          = document.createElement( "li" );
        member.innerHTML    = this.highlightSearchString( memberData.name, this.searchMembers.value );
        member.id           = memberData._id;

        const checkbox        = document.createElement( "span" );
        checkbox.className  = "create-team-member-checkbox";

        member.appendChild( checkbox );

        this.memberContainer.insertBefore( member, this.memberContainer.firstChild );

        if ( this.selectedMembers.indexOf( member.id ) !== -1 ) member.classList.add( "active" );

        member.addEventListener( "click", () => {
            const memberId = member.id;

            if ( member.classList.contains( "active" ) ) {
                member.classList.remove( "active" );
                this.selectedMembers = this.selectedMembers.filter( id => id !== memberId );
            } else {
                member.classList.add( "active" );
                this.selectedMembers.push( memberId );
            }

        });

    }



    private highlightSearchString(itemName: string, searchString:string): string {

        if ( ! searchString ) return itemName;

        const pattern = new RegExp( '(' + searchString + ')', "gi" );

        return itemName.replace( pattern, "<strong>$1</strong>" );
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

        this.memberContainer.innerHTML = '';

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
        this.mainMemberContainer.style.display  = "none";
        this.emptySearchResults.style.display   = "block";
    }



    private hideEmptyState(): void {
        this.emptySearchResults.style.display   = "none";
        this.mainMemberContainer.style.display  = "block";
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in scrum create team view component" );

        this.registerEventListeners();
        this.populate();
        this.teamNameInput.focus();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum create team view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }

}


import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";
import {Member} from "./Member";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;

declare const SimpleBar: any;


// HTML
const template = require( "../../../templates/manage-members.html" );






export class ManageMembers extends ViewComponent {
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



    constructor(view: View, container: HTMLElement) {
        super( view, container, "ManageMembers" );

        this.container.parentNode.removeChild( this.container );

        this.container.innerHTML            = template;

        this.memberSearch                   = this.container.querySelector( "#manage-members-search-input" ) as HTMLInputElement;
        this.clearSearch                    = this.container.querySelector( "#manage-members-clear-input" ) as HTMLElement;
        this.filterBtn                      = this.container.querySelector( "#manage-members-filter-btn" ) as HTMLElement;
        this.filterDropdown                 = this.container.querySelector( "#manage-members-filter-dropdown" ) as HTMLElement;
        this.filterOptionAllMembers         = this.container.querySelector( "#manage-members-filter-option-all-members" ) as HTMLElement;
        this.filterOptionUncategorized      = this.container.querySelector( "#manage-members-filter-option-uncategorized" ) as HTMLElement;

        new SimpleBar( this.filterDropdown );

        this.filterTeamsList                = this.container.querySelector( "#manage-members-filter-team-list" ) as HTMLElement;
        this.emptySearch                    = this.container.querySelector( "#manage-member-empty-search-results" ) as HTMLElement;

        this.emptySearch                    = this.container.querySelector( "#manage-members-members-list-container" ) as HTMLElement;
        this.mainMemberList                 = this.container.querySelector( "#manage-members-members-list-container" ) as HTMLElement;

        new SimpleBar( this.mainMemberList );

        this.memberList                     = this.mainMemberList.getElementsByClassName( "simplebar-content" )[0] as HTMLElement;

    }



    private registerEventListeners(): void {

    }



    private unregisterEventListeners(): void {

    }



    private resetComponent(): void {
        //TODO reset component
    }



    private addMember(memberData: any): void {
        new Member( memberData, this.memberList );
    }



    private addTeamToFilter(team: any): void {
        const filter        = document.createElement( "div" );
        filter.className    = "options-list-btn";
        filter.innerText    = team.name;

        this.filterTeamsList.appendChild( filter );
    }



    private populate(): void {

        /** Populate members */

        this.connection.getMembers(
            (response: any) => {
                const { members } = response;

                console.log( members );

                if ( members.length ) this.memberList.innerHTML = '';

                for ( let member of members ) {
                    this.addMember( member );
                }
            },
            (err: Error) => console.error( err )
        );

        /** Populate filters */

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



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in manage members" );
        this.registerEventListeners();
        this.populate();


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
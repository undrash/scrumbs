
// HTML
const template = require( "../../../templates/manage-members-member.html" );

export class Member {
    private parent: HTMLElement;
    private container: HTMLElement;

    private name: HTMLElement;
    private categories: HTMLElement;
    private optionsBtn: HTMLElement;

    private optionsDropdown: HTMLElement;
    private optionEdit: HTMLElement;
    private optionDelete: HTMLElement;



    constructor(data: any, parent: HTMLElement) {

        this.parent                 = parent;

        this.container              = document.createElement( "div" );
        this.container.className    = "manage-members-members-list-item";

        this.container.innerHTML    = template;

        this.name                   = this.container.querySelector( ".member-list-item" ) as HTMLElement;
        this.categories             = this.container.querySelector( ".member-item-category-container" ) as HTMLElement;
        this.optionsBtn             = this.container.querySelector( ".options-btn" ) as HTMLElement;

        this.populateCategories( data.teams );

        this.optionsDropdown        = this.container.querySelector( ".options-list-bg" ) as HTMLElement;
        this.optionEdit             = this.container.querySelector( ".edit" ) as HTMLElement;
        this.optionDelete           = this.container.querySelector( ".delete" ) as HTMLElement;

        this.name.innerText         = data.name;


        this.parent.appendChild( this.container );
    }



    private registerEventListeners(): void {

    }



    private unregisterEventListeners(): void {

    }



    private populateCategories(teams: any[]): void {

        if ( ! teams.length ) {
            const category      = document.createElement( "p" );
            category.className  = "member-category";
            category.innerText  = "Uncategorised";
            this.categories.appendChild( category );
            return;
        }

        for ( let team of teams ) {
            const category      = document.createElement( "p" );
            category.className  = "member-category";
            category.innerText  = team.name;

            this.categories.appendChild( category );
        }
    }



    public destroy(): void {

    }

}

import {EditMemberModel} from "../../../connection/models/EditMemberModel";
import {ConfirmationModal} from "../../../common/ConfirmationModal";
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {SnackBarType} from "../../../common/SnackBarType";
import {ManageTeamSignals} from "./ManageTeamSignals";
import {ModalTypes} from "../../../common/ModalTypes";
import {SnackBar} from "../../../common/SnackBar";
import {ManageMembers} from "./ManageMembers";

// HTML

const template = require( "../../../templates/manage-members-member.html" );



export class Member {
    private component: ManageMembers;

    private parent: HTMLElement;
    private container: HTMLElement;
    private connection: ConnectionProxy;
    private snackbar: SnackBar;

    public id: string;

    private displayContainer: HTMLElement;

    private name: HTMLElement;
    private categories: HTMLElement;

    private optionsBtn: HTMLElement;
    private optionsDropdown: HTMLElement;
    private optionEdit: HTMLElement;
    private optionDelete: HTMLElement;

    private editContainer: HTMLElement;
    private editNameInput: HTMLInputElement;
    private editSaveBtn: HTMLElement;
    private editCancelBtn: HTMLElement;


    constructor(component: ManageMembers, data: any, parent: HTMLElement) {

        this.component              = component;

        this.parent                 = parent;
        this.id                     = data._id;

        this.connection             = new ConnectionProxy( `member-item-${ this.id }` );
        this.snackbar               = SnackBar._instance;

        this.container              = document.createElement( "div" );
        this.container.className    = "manage-members-members-list-item";

        this.container.innerHTML    = template;

        this.displayContainer       = this.container.querySelector( ".manage-members-list-item-display-container" ) as HTMLElement;

        this.name                   = this.container.querySelector( ".member-list-item" ) as HTMLElement;
        this.categories             = this.container.querySelector( ".member-item-category-container" ) as HTMLElement;
        this.optionsBtn             = this.container.querySelector( ".options-btn" ) as HTMLElement;

        this.populateCategories( data.teams );

        this.optionsDropdown        = this.container.querySelector( ".options-list-bg" ) as HTMLElement;
        this.optionEdit             = this.container.querySelector( ".edit" ) as HTMLElement;
        this.optionDelete           = this.container.querySelector( ".delete" ) as HTMLElement;

        this.name.innerText         = data.name;
        this.optionsBtn.id          = `options-btn-${ this.id }`;

        this.editContainer          = this.container.querySelector( ".manage-members-members-list-item-edit-container" ) as HTMLElement;

        this.editNameInput          = this.container.querySelector( ".edit-member-input" ) as HTMLInputElement;

        this.editSaveBtn            = this.container.querySelector( ".edit-member-save" ) as HTMLElement;
        this.editCancelBtn          = this.container.querySelector( ".edit-member-cancel" ) as HTMLElement;

        this.parent.appendChild( this.container );

        this.optionsBtnListener     = this.optionsBtnListener.bind( this );
        this.documentClickListener  = this.documentClickListener.bind( this );
        this.deleteListener         = this.deleteListener.bind( this );
        this.editListener           = this.editListener.bind( this );
        this.editSaveListener       = this.editSaveListener.bind( this );
        this.editCancelListener     = this.editCancelListener.bind( this );
        this.editKeyListener        = this.editKeyListener.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {
        this.optionsBtn.addEventListener( "click", this.optionsBtnListener );
        this.optionDelete.addEventListener( "click", this.deleteListener );
        this.optionEdit.addEventListener( "click", this.editListener );
        this.editSaveBtn.addEventListener( "click", this.editSaveListener );
        this.editCancelBtn.addEventListener( "click", this.editCancelListener );
        this.editContainer.addEventListener( "keydown", this.editKeyListener );
        document.addEventListener( "click", this.documentClickListener );
    }



    private unregisterEventListeners(): void {
        this.optionsBtn.removeEventListener( "click", this.optionsBtnListener );
        this.optionDelete.removeEventListener( "click", this.deleteListener );
        this.optionEdit.removeEventListener( "click", this.editListener );
        this.editSaveBtn.removeEventListener( "click", this.editSaveListener );
        this.editCancelBtn.removeEventListener( "click", this.editCancelListener );
        this.editNameInput.removeEventListener( "keydown", this.editKeyListener );
        document.removeEventListener( "click", this.documentClickListener );
    }



    private optionsBtnListener(): void {
        this.optionsDropdown.style.display = "block";
    }



    private documentClickListener(e: any): void {
        if ( e.target.id !== this.optionsBtn.id ) this.optionsDropdown.style.display = "none";
    }



    private editListener(): void {
        this.enterEditState();
    }



    private editSaveListener(): void {

        const editMemberModel = new EditMemberModel( this.id, this.editNameInput.value );

        this.connection.editMember(
            editMemberModel,
            (response: any) => {
                const { name } = response.member;

                this.name.innerText = name;
                this.exitEditState();
            },
            (err: string) => console.error( err )
        );
    }



    private editCancelListener(): void {
        this.exitEditState();
    }



    private editKeyListener(e: any): void {

        const key = e.which || e.keyCode;

        if ( key === 27 ) { // ESC

            this.exitEditState();

        } else if ( key === 13 ) { // ENTER

            this.editSaveListener();
        }
    }



    private enterEditState(): void {
        this.editNameInput.value            = this.name.innerText;
        this.displayContainer.style.display = "none";
        this.editContainer.style.display    = "block";

        this.editNameInput.focus();

        this.component.sendSignal( ManageTeamSignals.FOREGROUND_ACTIVE );
    }



    private exitEditState(): void {
        this.editContainer.style.display    = "none";
        this.displayContainer.style.display = "block";
        this.editNameInput.value            = '';

        setTimeout( () => this.component.sendSignal( ManageTeamSignals.FOREGROUND_INACTIVE ), 0 );
    }



    private deleteListener(): void {
        const memberName        = this.name.innerText;


        new ConfirmationModal(
            ModalTypes.DELETE,
            "Yes, Delete Member",
            "Cancel, Keep Member",
            "Delete member",
            [
                `Are you sure you want to permanently delete <strong>${ memberName }</strong>?`,
                "<br> All their notes and impediments across all teams will be deleted, and the operation cannot be undone."
            ]
        )
            .onSubmit( () => {

                this.connection.deleteMember(
                    this.id,
                    () => {
                        this.destroy();
                        this.snackbar.show( SnackBarType.SUCCESS, `Deleted member <strong>${ memberName }</strong>` );
                    },
                    (err: string) => console.error( err )
                );
            })
            .onDismiss( () => console.info( "Modal dismissed." ) );
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



    private enterScene(): void {
        this.registerEventListeners();
    }


    public destroy(): void {
        this.unregisterEventListeners();
        this.parent.removeChild( this.container );
    }

}
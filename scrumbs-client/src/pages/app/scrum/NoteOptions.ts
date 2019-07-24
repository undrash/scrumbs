
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {HTMLHelper} from "../../../helpers/HTMLHelper";
import {Note} from "./Note";

const template = require( "../../../templates/note-options.html" );





export class NoteOptions {
    private parent: HTMLElement;
    private container: HTMLUListElement;

    private target: Note;
    private targetContainer: HTMLElement;

    private convertToImpedimentBtn: HTMLElement;
    private convertToNoteBtn: HTMLElement;
    private editBtn: HTMLElement;
    private deleteBtn: HTMLElement;

    private connection: ConnectionProxy;


    constructor(target: Note) {

        this.connection             = new ConnectionProxy( "NoteOptionsProxy" );

        this.target                 = target;
        this.targetContainer        = this.target.parent;

        this.container              = document.createElement( "ul" );
        this.container.className    = "scrum-note-options-list";

        if ( this.target.container.classList.contains( "impediment" ) ) this.container.classList.add( "impediment" );

        this.container.innerHTML    = template;

        this.convertToNoteBtn       = this.container.querySelector( ".scrum-note-option-convert-to-note" ) as HTMLElement;
        this.convertToImpedimentBtn = this.container.querySelector( ".scrum-note-option-convert-to-impediment" ) as HTMLElement;
        this.editBtn                = this.container.querySelector( ".scrum-note-option-edit-note" ) as HTMLElement;
        this.deleteBtn              = this.container.querySelector( ".scrum-note-option-delete-note" ) as HTMLElement;

        this.parent                 = document.getElementById( "scrum-notes" );

        this.parent.appendChild( this.container );

        this.positionDropdown();

        this.documentClickListener          = this.documentClickListener.bind( this );
        this.positionDropdown               = this.positionDropdown.bind( this );
        this.scrollListener                 = this.scrollListener.bind( this );
        this.convertToNoteListener          = this.convertToNoteListener.bind( this );
        this.convertToImpedimentListener    = this.convertToImpedimentListener.bind( this );


        this.enterScene();

    }



    private registerEventListeners(): void {
        this.convertToNoteBtn.addEventListener( "click", this.convertToNoteListener );
        this.convertToImpedimentBtn.addEventListener( "click", this.convertToImpedimentListener );
        document.addEventListener( "click", this.documentClickListener);
        window.addEventListener( "resize", this.positionDropdown );
        this.targetContainer.addEventListener( "scroll", this.scrollListener );
    }



    private unregisterEventListeners(): void {
        this.convertToNoteBtn.removeEventListener( "click", this.convertToNoteListener );
        this.convertToImpedimentBtn.removeEventListener( "click", this.convertToImpedimentListener );
        document.removeEventListener( "click", this.documentClickListener);
        window.removeEventListener( "resize", this.positionDropdown );
        this.targetContainer.removeEventListener( "scroll", this.scrollListener );

    }



    private convertToNoteListener(): void {

        this.connection.convertNote(
            this.target.id,
            false,
            () => this.target.container.classList.remove( "impediment" ),
            (err: Error) => console.error( err )
        );
    }



    private convertToImpedimentListener(): void {
        this.connection.convertNote(
            this.target.id,
            true,
            () => this.target.container.classList.add( "impediment" ),
            (err: Error) => console.error( err )
        );
    }


    private documentClickListener(e: any): void {
        if ( e.target.id !== this.target.optionsBtn.id ) this.exitScene();
    }



    private scrollListener(): void {
        this.exitScene();
    }



    private positionDropdown(): void {

        if ( ! this.target ) return;

        const { optionsBtn } = this.target;

        const position      = HTMLHelper.getPositionToTargetId( optionsBtn, this.parent.id );

        const offsetX       = 220;
        const offsetY       = 25;

        /** If there's no space at the bottom, render it above */
        if ( this.parent.clientHeight - ( position.y + offsetY ) < this.container.clientHeight ) {
            position.y -= ( this.container.clientHeight + offsetY );
        }


        this.container.style.left   = `${ position.x - offsetX }px`;
        this.container.style.top    = `${ position.y + offsetY }px`;
    }



    private enterScene() {
        this.registerEventListeners();
        this.target.container.classList.add( "active" );
        this.container.style.visibility = "visible";
    }



    private exitScene() {
        this.unregisterEventListeners();
        this.target.container.classList.remove( "active" );
        this.container.parentNode.removeChild( this.container );
    }

}
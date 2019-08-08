
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {NoteOptions} from "./NoteOptions";

const template = require( "../../../templates/note.html" );






export class Note {
    public id: string;
    public container: HTMLElement;
    public parent: HTMLElement;

    private note: any;

    private content: HTMLElement;
    public optionsBtn: HTMLElement;
    private optionsDropdown: HTMLElement;
    private checkmark: HTMLElement;

    private convertToNote: HTMLElement;
    private convertToImpediment: HTMLElement;
    private editNote: HTMLElement;
    private deleteNote: HTMLElement;



    constructor(parent: HTMLElement, data: any, prepend?: boolean) {

        this.id                     = data._id;
        this.note                   = data;
        this.parent                 = parent;

        this.container              = document.createElement( "div" );
        this.container.className    = "scrum-note pointer";
        this.container.id           = this.id;

        this.container.innerHTML    = template;

        this.content                = this.container.querySelector( ".scrum-note-text" ) as HTMLElement;
        this.optionsBtn             = this.container.querySelector( ".scrum-note-options-button" ) as HTMLElement;
        this.optionsDropdown        = this.container.querySelector( ".scrum-note-options-list" ) as HTMLElement;
        this.checkmark              = this.container.querySelector( ".scrum-note-checkmark" ) as HTMLElement;

        this.convertToNote          = this.container.querySelector( ".scrum-note-option-convert-to-note" ) as HTMLElement;
        this.convertToImpediment    = this.container.querySelector( ".scrum-note-option-convert-to-impediment" ) as HTMLElement;
        this.editNote               = this.container.querySelector( ".scrum-note-option-edit-note" ) as HTMLElement;
        this.deleteNote             = this.container.querySelector( ".scrum-note-option-delete-note" ) as HTMLElement;

        this.optionsBtn.id          = `${ this.id }-options`;

        this.content.innerText      = this.note.content;

        if ( this.note.isImpediment )   this.container.classList.add( "impediment" );
        if ( this.note.isSolved )       this.container.classList.add( "solved" );


        if ( prepend ) {
            this.parent.insertBefore( this.container, this.parent.firstChild );
        } else {
            this.parent.appendChild( this.container );
        }

        this.checkMarkListener  = this.checkMarkListener.bind( this );
        this.optionsListener    = this.optionsListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.checkmark.addEventListener( "click", this.checkMarkListener );
        this.optionsBtn.addEventListener( "click", this.optionsListener );
    }


    private unregisterEventListeners(): void {
        this.checkmark.removeEventListener( "click", this.checkMarkListener );
        this.optionsBtn.removeEventListener( "click", this.optionsListener );
    }


    private checkMarkListener(): void {
        this.container.classList.contains( "solved" ) ? this.unsolveImpediment() : this.solveImpediment();
    }



    private optionsListener(): void {
        new NoteOptions( this );
    }



    private solveImpediment(): void {

        const connection = new ConnectionProxy( `${ this.id }-proxy` );

        connection.solveImpediment(
            this.id,
            () => this.container.classList.add( "solved" ),
            (err: string) => console.error( err )
        );
    }



    private unsolveImpediment(): void {

        const connection = new ConnectionProxy( `${ this.id }-proxy` );

        connection.unsolveImpediment(
            this.id,
            () => this.container.classList.remove( "solved" ),
            (err: string) => console.error( err )
        )
    }



    public getNote(): any {
        return this.note;
    }



    public setNote(noteData: any): void {
        this.note               = noteData;
        this.content.innerText  = noteData.content;

        if ( noteData.isImpediment ) {
            if ( ! this.container.classList.contains( "impediment" ) ) this.container.classList.add( "impediment" );
        } else {
            this.container.classList.remove( "impediment" );
        }
    }



    private enterScene(): void {
        this.registerEventListeners();
    }



    public destroy(): void {
        this.unregisterEventListeners();

        /** If it's the only one on that date, remove the date separator */
        if (
            this.container.previousElementSibling.classList.contains( "scrum-note-date" ) &&
            ! this.container.nextSibling

            ||

            this.container.previousElementSibling.classList.contains( "scrum-note-date" ) &&
            this.container.nextElementSibling.classList.contains( "scrum-note-date" )
        ) {
            this.container.previousElementSibling.parentNode.removeChild( this.container.previousElementSibling );
        }

        this.container.parentNode.removeChild( this.container );
    }

}

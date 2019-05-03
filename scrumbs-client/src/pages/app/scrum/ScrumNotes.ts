
import {CreateNoteModel} from "../../../connection/models/CreateNoteModel";
import {EditMemberModel} from "../../../connection/models/EditMemberModel";
import {ConfirmationModal} from "../../../common/ConfirmationModal";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {SnackBarType} from "../../../common/SnackBarType";
import {ModalTypes} from "../../../common/ModalTypes";
import {ScrumSignals} from "./ScrumSignals";
import {View} from "../../../core/View";

import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;


declare const SimpleBar: any;

// CSS
import "../../../style/style-sheets/scrum-notes.scss";

// HTML
const template = require( "../../../templates/scrum-notes.html" );






export class ScrumNotes extends ViewComponent {
    private memberName: HTMLHeadingElement;
    private memberNameInput: HTMLInputElement;
    private memberId: string;
    private memberTeamId: string;

    private options: HTMLDivElement;
    private optionsDropDown: HTMLUListElement;
    private optionExportNotes: HTMLLIElement;
    private optionExportImpediments: HTMLLIElement;
    private optionClearNotes: HTMLLIElement;
    private optionRemoveMember: HTMLLIElement;


    private notesMainContainer: HTMLUListElement;
    private notesContainer: HTMLDivElement;

    private noteInput: HTMLInputElement;
    private impedimentCheckbox: HTMLInputElement;

    private emptyState: HTMLDivElement;


    /** Load more feature related properties */
    private noteBatchIndex: number;
    private datesDisplayed: string[];


    constructor(view: View, container: HTMLElement) {
        super( view, container, "ScrumNotes" );

        this.noteBatchIndex = 0;
        this.datesDisplayed = [];

        this.container.innerHTML        = template;

        this.memberName                 = document.getElementById( "scrum-notes-member-name" ) as HTMLHeadingElement;
        this.memberNameInput            = document.getElementById( "scrum-notes-member-name-input" ) as HTMLInputElement;
        this.options                    = document.getElementById( "scrum-notes-member-options-button" ) as HTMLDivElement;
        this.optionsDropDown            = document.getElementById( "scrum-notes-member-options-list" ) as HTMLUListElement;
        this.optionExportNotes          = document.getElementById( "scrum-notes-member-option-export-notes" ) as HTMLLIElement;
        this.optionExportImpediments    = document.getElementById( "scrum-notes-member-option-export-impediments" ) as HTMLLIElement;
        this.optionClearNotes           = document.getElementById( "scrum-notes-member-option-clear-notes" ) as HTMLLIElement;
        this.optionRemoveMember         = document.getElementById( "scrum-notes-member-option-remove-member" ) as HTMLLIElement;

        this.emptyState                 = document.getElementById( "scrum-note-empty-state-container" ) as HTMLDivElement;

        this.notesMainContainer         = document.getElementById( "scrum-notes-note-container" ) as HTMLUListElement;

        new SimpleBar( this.notesMainContainer );

        this.notesContainer         = this.notesMainContainer.getElementsByClassName( "simplebar-content" )[0] as HTMLDivElement;

        this.noteInput              = document.getElementById( "scrum-note-input" ) as HTMLInputElement;
        this.impedimentCheckbox     = document.getElementById( "scrum-notes-impediment-checkbox" ) as HTMLInputElement;

        this.noteInputListener              = this.noteInputListener.bind( this );
        this.loadMoreNotes                  = this.loadMoreNotes.bind( this );
        this.memberNameListener             = this.memberNameListener.bind( this );
        this.memberNameInputBlurListener    = this.memberNameInputBlurListener.bind( this );
        this.memberNameKeydownListener      = this.memberNameKeydownListener.bind( this );
        this.optionsBtnListener             = this.optionsBtnListener.bind( this );
        this.documentClickListener          = this.documentClickListener.bind( this );
        this.clearNotesListener             = this.clearNotesListener.bind( this );
        this.removeMemberListener           = this.removeMemberListener.bind( this );
        this.exportNotesListener            = this.exportNotesListener.bind( this );
        this.exportImpedimentsListener      = this.exportImpedimentsListener.bind( this );

        this.enterScene();

    }



    private registerEventListeners(): void {
        this.memberName.addEventListener( "click", this.memberNameListener );
        this.memberNameInput.addEventListener( "blur", this.memberNameInputBlurListener );
        this.memberNameInput.addEventListener( "keydown", this.memberNameKeydownListener );
        this.noteInput.addEventListener( "keyup", this.noteInputListener );
        this.notesContainer.addEventListener( "scroll", this.loadMoreNotes );
        this.options.addEventListener( "click", this.optionsBtnListener );
        this.optionClearNotes.addEventListener( "click", this.clearNotesListener );
        this.optionRemoveMember.addEventListener( "click", this.removeMemberListener );
        this.optionExportNotes.addEventListener( "click", this.exportNotesListener );
        this.optionExportImpediments.addEventListener( "click", this.exportImpedimentsListener );
        document.addEventListener( "click", this.documentClickListener );
    }



    private unregisterEventListeners(): void {
        this.memberName.removeEventListener( "click", this.memberNameListener );
        this.memberNameInput.removeEventListener( "blur", this.memberNameInputBlurListener );
        this.memberNameInput.removeEventListener( "keydown", this.memberNameKeydownListener );
        this.noteInput.removeEventListener( "keyup", this.noteInputListener );
        this.notesContainer.removeEventListener( "scroll", this.loadMoreNotes );
        this.options.removeEventListener( "click", this.optionsBtnListener );
        this.optionClearNotes.removeEventListener( "click", this.clearNotesListener );
        this.optionRemoveMember.removeEventListener( "click", this.removeMemberListener );
        this.optionExportNotes.removeEventListener( "click", this.exportNotesListener );
        this.optionExportImpediments.removeEventListener( "click", this.exportImpedimentsListener );
        document.removeEventListener( "click", this.documentClickListener );
    }



    private memberNameListener(): void {
        this.memberName.style.display       = "none";
        this.memberNameInput.style.display  = "block";
        this.memberNameInput.value          = this.memberName.innerText;
        this.memberNameInput.focus();
    }



    private memberNameInputBlurListener(): void {
        this.memberNameInput.style.display = "none";

        if ( this.memberNameInput.value && this.memberNameInput.value !== this.memberName.innerText ) {

            this.updateMemberName( this.memberNameInput.value );
            this.memberNameInput.value = null;

        } else {

            this.memberName.style.display = "block";
        }
    }



    private memberNameKeydownListener(e: any): void {

        const key = e.which || e.keyCode;

        if ( key === 27 ) { // ESC

            this.memberNameInput.value = null;
            this.memberNameInput.blur();

        } else if ( key === 13 ) { // ENTER

            this.updateMemberName( this.memberNameInput.value );
            this.memberNameInput.value = null;
            this.memberNameInput.blur();
        }
    }



    private optionsBtnListener(e: any): void {
        this.optionsDropDown.style.display = this.optionsDropDown.style.display === "block" ? "none" : "block";
    }



    private clearNotesListener(): void {

        const memberName        = this.memberName.innerText;
        const memberTeamName    = document.getElementById( `${ this.memberTeamId }@name` ).innerText;



        new ConfirmationModal(
            ModalTypes.DELETE,
            "Yes, Clear Notes",
            "Cancel, Keep Notes",
            "Clear member notes",
            [
                `Are you sure you want to clear all notes of <strong>${ memberName }</strong>?`,
                `All their notes and impediments associated with the team <strong>${ memberTeamName }</strong> will be deleted, and the operation cannot be undone.`
            ]
        )
            .onSubmit( () => {
                this.connection.deleteNotesOfMember(
                    this.memberId,
                    this.memberTeamId,
                    () => {

                        this.notesMainContainer.style.display   = "none";
                        this.emptyState.style.display           = "block";
                        this.notesContainer.innerHTML           = null;

                        this.snackbar.show( SnackBarType.SUCCESS, `Cleared notes of ${ memberName }` );
                    },
                    (err: string) => console.error( err )
                );

            })
            .onDismiss( () => console.info( "Modal dismissed" ) );
    }



    private removeMemberListener(): void {

        const memberName    = this.memberName.innerText;
        const memberId      = this.memberId;

        new ConfirmationModal(
            ModalTypes.DELETE,
            "Yes, Delete Member",
            "Cancel, Keep Member",
            "Delete member",
            [
                `Are you sure you want to delete <strong>${ memberName }</strong>?`,
                "All the notes and impediments will be deleted, and the operation cannot be undone."
            ]
        )
            .onSubmit( () => {

                this.connection.deleteMember(
                    this.memberId,
                    () => {
                        this.sendSignal( ScrumSignals.MEMBER_DELETED, memberId );
                        this.snackbar.show( SnackBarType.SUCCESS, `Deleted member ${ memberName }` );
                    },
                    (err: string) => console.error( err )
                );
            })
            .onDismiss( () => console.info( "Modal dismissed." ) );
    }



    private documentClickListener(e: any): void {
        if ( e.target.id !== this.options.id ) this.optionsDropDown.style.display = "none";
    }



    private exportNotesListener(): void {
        this.snackbar.show( SnackBarType.WARNING, "Export feature coming soon" );
    }



    private exportImpedimentsListener(): void {
        this.snackbar.show( SnackBarType.WARNING, "Export feature coming soon" );
    }



    private updateMemberName(name: string): void {

        const editMemberModel = new EditMemberModel( this.memberId, name );

        this.connection.editMember(
            editMemberModel,
            (response: any) => {

                const { name, _id } = response.member;

                this.memberName.innerText       = name;
                this.memberName.style.display   = "block";

                this.sendSignal( ScrumSignals.MEMBER_UPDATED, { memberId: _id, name } );
            },
            (err: string) => console.error( err )
        );
    }



    private loadMoreNotes(): void {

        if ( this.notesContainer.scrollTop !== 0 ) return;

        this.connection.getNotesOfMember(
            this.memberId,
            this.memberTeamId,
            this.noteBatchIndex,
            15,
            (response: any) => {

                const { notes } = response;

                if ( notes.length ) this.populate( response.notes, true );

            },
            (err: any) => console.error( err )
        );

    }



    public loadMemberNotes(memberData: any): void {
        const { id, team, name } = memberData;

        if ( ! id || ! name || ! team ) {
            console.error( "Invalid member data, unable to load notes." );
            return;
        }

        this.memberId                   = id;
        this.memberTeamId               = team;
        this.memberName.innerText       = name;

        console.log( id, team );

        this.resetNotesContainer();

        this.connection.getNotesOfMember(
            id,
            team,
            this.noteBatchIndex,
            15,
            (response: any) => {
                console.log( response );

                this.populate( response.notes );
            },
            (err: any) => console.error( err )
        );

        this.noteInput.focus();
    }


    
    private resetNotesContainer(): void {
        this.notesContainer.innerHTML   = "";
        this.noteBatchIndex             = 0;
        this.datesDisplayed             = [];
    }



    private noteInputListener(e: any) {

        if ( ! this.noteInput.value ) return; // Abort if input EMPTY

        const key = e.which || e.keyCode;

        this.checkForImpedimentFlag();

        if ( key !== 13 ) return; // If not ENTER, abort.

        const createNoteModel = new CreateNoteModel(
            this.memberId,
            this.memberTeamId,
            this.noteInput.value,
            this.impedimentCheckbox.checked
        );

        this.noteInput.value            = null;
        this.impedimentCheckbox.checked = false;

        this.connection.createNote(
            createNoteModel,
            (response: any) => {
                const { note } = response;

                console.log( response );

                const currentDate = this.getParsedDate( new Date().toISOString() );

                /** If this is the first note, we hide the empty state and display the container */
                if ( this.notesMainContainer.style.display === "none" ) {
                    this.emptyState.style.display           = "none";
                    this.notesMainContainer.style.display   = "block";

                    /** Add a separator with the current date */
                    this.addSeparator( currentDate );
                }

                /** If this is the first note today, add a separator */
                if ( this.datesDisplayed.indexOf( currentDate ) === -1 ) {
                    /** Add a separator with the current date */
                    this.addSeparator( currentDate );
                }

                /** Add the note */
                this.addNote( note );


            },
            (err: string) => console.error( err )
        );
    }



    private checkForImpedimentFlag() {

        if ( this.noteInput.value.indexOf( "#im" ) !== -1 ) {
            this.impedimentCheckbox.checked = true;
            this.noteInput.value = this.noteInput.value.replace( "#im", "" );
        }
    }



    public populate(notes: any[], prepend?: boolean): void {

        /** If there are no notes for the member, hide the notes container and show the empty state */
        if ( ! notes.length ) {
            this.notesMainContainer.style.display   = "none";
            this.emptyState.style.display           = "block";
            return;
        }

        this.notesMainContainer.style.display       = "block";
        this.emptyState.style.display               = "none";

        this.noteBatchIndex++;

        let date = null;

        /** If the populate is triggered by the load more notes function, we'll need to prepend the incoming notes */
        if ( prepend ) {

            for ( let note of notes ) {
                let noteCreated = this.getParsedDate( note.date );

                this.addNote( note, prepend );

                /** If it's a new date, AND the date is not yet present -> add a separator before adding the note */

                if ( date !== noteCreated && this.datesDisplayed.indexOf( noteCreated ) === -1 ) {
                    this.addSeparator( noteCreated, prepend );
                    date = noteCreated;
                }
            }

        } else {

            for ( let i = notes.length - 1; i >= 0; i-- ) {
                let noteCreated = this.getParsedDate( notes[i].date );

                /** If it's a new date, AND the date is not yet present -> add a separator before adding the note */
                if ( date !== noteCreated && this.datesDisplayed.indexOf( noteCreated ) === -1 ) {
                    this.addSeparator( noteCreated );
                    date = noteCreated;
                }

                this.addNote( notes[i] );
            }
        }
    }



    public addNote(noteData: any, prepend?: boolean): void {

        let note        = document.createElement( "li" );
        note.id         = noteData._id;
        note.className  = "scrum-note pointer";

        if ( noteData.isImpediment ) note.classList.add( "impediment" );
        if ( noteData.isSolved ) note.classList.add( "solved" );

        let noteText            = document.createElement( "p" );
        noteText.className      = "scrum-note-text";
        noteText.innerText      = noteData.content;

        let noteOptions         = document.createElement( "div" );
        noteOptions.className   = "scrum-note-options-button";

        let noteCheckmark       = document.createElement( "span" );
        noteCheckmark.className = "scrum-note-checkmark";

        note.appendChild( noteText );
        note.appendChild( noteOptions );
        note.appendChild( noteCheckmark );


        noteCheckmark.addEventListener( "click", () => {

            if ( note.classList.contains( "solved" ) ) {
                this.unsolveImpediment( note );
            } else {
                this.solveImpediment( note );
            }
        });

        if ( prepend ) {
            this.notesContainer.insertBefore( note, this.notesContainer.firstChild );
        } else {
            this.notesContainer.appendChild( note );
        }

        if ( this.noteBatchIndex <= 1 ) {
            this.notesContainer.scrollTo( 0, this.notesContainer.scrollHeight );
        } else {
            this.notesContainer.scrollTo( 0, this.notesContainer.scrollHeight / 25 );
        }
    }



    public addSeparator(date: string, prepend?: boolean) {

        this.datesDisplayed.push( date );

        console.log( this.datesDisplayed );

        let separator       = document.createElement( "li" );
        separator.className = "scrum-note-date bold";

        let dateText        = document.createElement( "span" );
        dateText.innerText  = date;

        separator.appendChild( dateText );


        if ( prepend ) {
            this.notesContainer.insertBefore( separator, this.notesContainer.firstChild );
        } else {
            this.notesContainer.appendChild( separator );
        }
    }



    public getParsedDate(dateISO: string): string {
        const date  = new Date( dateISO );
        const year  = date.getFullYear();
        const day   = date.getDate();
        const month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ][ date.getMonth() ];


        return `${ month } ${ day } ${ year }`;
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in scrum notes view component" );

        switch ( enterType ) {

            case ViewEnterTypes.REVEAL_COMPONENT :

                this.container.style.display = "block";

                break;


            default :
                this.registerEventListeners();
                break;
        }
    }



    public solveImpediment(note: HTMLElement): void {

        this.connection.solveImpediment(
            note.id,
            () => note.classList.add( "solved" ),
            (err: string) => console.error( err )
        );
    }



    public unsolveImpediment(note: HTMLElement): void {

        this.connection.unsolveImpediment(
            note.id,
            () => note.classList.remove( "solved" ),
            (err: string) => console.error( err )
        )
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in scrum notes view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }
}

import {ConnectionProxy} from "../../../connection/ConnectionProxy";

const template = require( "../../../templates/note.html" );






export class Note {
    private id: string;
    private container: HTMLElement;
    private parent: HTMLElement;

    private note: any;

    private content: HTMLElement;
    private options: HTMLElement;
    private checkmark: HTMLElement;



    constructor(parent: HTMLElement, data: any, prepend?: boolean) {

        this.id                     = data._id;
        this.note                   = data;
        this.parent                 = parent;

        this.container              = document.createElement( "div" );
        this.container.className    = "scrum-note pointer";
        this.container.id           = this.id;

        this.container.innerHTML    = template;

        this.content                = this.container.querySelector( ".scrum-note-text" ) as HTMLElement;
        this.options                = this.container.querySelector( ".scrum-note-options-button" ) as HTMLElement;
        this.checkmark              = this.container.querySelector( ".scrum-note-checkmark" ) as HTMLElement;

        this.content.innerText      = this.note.content;

        if ( this.note.isImpediment )   this.container.classList.add( "impediment" );
        if ( this.note.isSolved )       this.container.classList.add( "solved" );


        if ( prepend ) {
            this.parent.insertBefore( this.container, this.parent.firstChild );
        } else {
            this.parent.appendChild( this.container );
        }

        this.checkMarkListener = this.checkMarkListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.checkmark.addEventListener( "click", this.checkMarkListener );
    }



    private checkMarkListener(): void {
        this.container.classList.contains( "solved" ) ? this.unsolveImpediment() : this.solveImpediment();
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



    private enterScene(): void {
        this.registerEventListeners();
    }

}

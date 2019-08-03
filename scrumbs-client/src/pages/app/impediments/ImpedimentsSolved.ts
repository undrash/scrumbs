
import {ImpedimentSignals} from "./ImpedimentSignals";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";


import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;



// CSS
import "../../../style/style-sheets/impediments-solved.scss";


// HTML
const template = require( "../../../templates/impediments-solved.html" );






export class ImpedimentsSolved extends ViewComponent {

    private header: HTMLElement;
    private toggleVisibilityBtn: HTMLButtonElement;
    private solvedImpedimentsContainer: HTMLUListElement;



    constructor(view: View, container: HTMLElement) {
        super( view, container, "ImpedimentsSolved" );

        this.container.innerHTML = template;

        this.header                         = document.getElementById( "impediments-solved-header" );
        this.toggleVisibilityBtn            = document.getElementById( "impediments-solved-toggle-button" ) as HTMLButtonElement;
        this.solvedImpedimentsContainer     = document.getElementById( "impediments-solved-body" ) as HTMLUListElement;

        this.toggleVisibilityBtnListener = this.toggleVisibilityBtnListener.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.toggleVisibilityBtn.addEventListener( "click", this.toggleVisibilityBtnListener );
    }



    private unregisterEventListeners(): void {
        this.toggleVisibilityBtn.removeEventListener( "click", this.toggleVisibilityBtnListener );
    }



    private toggleVisibilityBtnListener(e: any): void {
        this.solvedImpedimentsContainer.style.display = this.solvedImpedimentsContainer.style.display === "block" ? "none" : "block";

        this.toggleVisibilityBtn.innerText = this.toggleVisibilityBtn.innerText === "Hide Completed" ? "Show Completed" : "Hide Completed";
    }



    public populateFiltered(memberId: string): void {

        this.solvedImpedimentsContainer.innerHTML = '';


        this.connection.getSolvedImpedimentsOfMember(
            memberId,
            (response: any) => {
                const { impediments } = response;

                if ( impediments.length ) {
                    this.header.style.display = "block";
                } else {
                    this.header.style.display = "none";
                    this.sendSignal( ImpedimentSignals.IMPEDIMENTS_SOLVED_EMPTY );
                }

                for ( let impediment of impediments ) {
                    this.addImpediment( impediment );
                }
            },
            (err: string) => console.error( err )
        );

    }



    public populate(): void {

        this.solvedImpedimentsContainer.innerHTML = '';

        this.connection.getSolvedImpediments(
            (response: any) => {
                const { impediments } = response;

                if ( impediments.length ) {
                    this.header.style.display = "block";
                } else {
                    this.header.style.display = "none";
                    this.sendSignal( ImpedimentSignals.IMPEDIMENTS_SOLVED_EMPTY );
                }

                for ( let impediment of impediments ) {
                    this.addImpediment( impediment );
                }
            },
            (err: string) => console.error( err )
        );
    }



    public addImpediment(impedimentData: any): void {

        if ( ! this.solvedImpedimentsContainer.children.length ) this.header.style.display = "block";


        const impediment          = document.createElement( "li" );
        impediment.className    = "impediments-solved-member-impediment pointer active";
        impediment.id           = impedimentData._id;
        impediment.innerText    = impedimentData.content;

        const checkbox            = document.createElement( "span" );
        checkbox.className          = "impediments-solved-member-impediment-checkbox";

        impediment.appendChild( checkbox );

        /** Check if member is already rendered, if so - we append */
        let memberContainer = document.getElementById( `solved-${ impedimentData.member ? impedimentData.member._id : "user-impediments" }` );

        if ( memberContainer ) {

            memberContainer.lastElementChild.appendChild( impediment );

        } else {
            /** If the member has no container on the page, we create it now */
            memberContainer                 = document.createElement( "li" );
            memberContainer.id              = `solved-${ impedimentData.member ? impedimentData.member._id : "user-impediments" }`;
            memberContainer.className       = "impediments-solved-member-container";

            let memberName                  = document.createElement( "h3" );
            memberName.innerText            = impedimentData.member ? impedimentData.member.name : "Your Impediments";
            memberName.className            = "impediments-solved-member-name bold";

            let impedimentsContainer        = document.createElement( "ul" );
            impedimentsContainer.className  = "impediments-solved-member-impediments";

            impedimentsContainer.appendChild( impediment );

            memberContainer.appendChild( memberName );
            memberContainer.appendChild( impedimentsContainer );

            this.solvedImpedimentsContainer.appendChild( memberContainer );
        }


        this.addListenerToImpediment( impediment );
    }



    private addListenerToImpediment(impediment: HTMLElement): void {

        impediment.addEventListener( "click", () => {
            impediment.classList.add( "active" );

            /** Save the id and deactivate it in the DOM */
            const impedimentId = impediment.id;
            impediment.id = null;

            /** Wait for the animation to complete, and remove the impediment element */
            setTimeout( () => {
                /** If this is the last node, remove the member container */
                if ( impediment.parentNode.childNodes.length < 2 ) {
                    impediment.parentNode.parentNode.parentNode.removeChild( impediment.parentNode.parentNode );
                } else {
                    impediment.parentNode.removeChild( impediment )
                }

                /** Hide the header if there are no solved impediments left */
                if ( ! this.solvedImpedimentsContainer.children.length ) {
                    this.header.style.display = "none";
                }
            }, 300 );

            this.connection.unsolveImpediment(
                impedimentId,
                (response: any) => {
                    console.log( response );

                    const { note } = response;
                    this.sendSignal( ImpedimentSignals.IMPEDIMENT_UNSOLVED, note );
                },
                (err: string) => console.error( err )
            )
        });
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in impediments solved view component" );
        this.registerEventListeners();
        this.populate();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in impediments solved view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }
}
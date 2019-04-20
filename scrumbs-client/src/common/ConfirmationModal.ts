

import "../style/style-sheets/confirmation-modal.scss";

const template = require( "../templates/confirmation-modal.html" );



export class ConfirmationModal {

    private modalBackground: HTMLElement;
    private modal: HTMLElement;
    private icon: HTMLElement;
    private closeBtn: HTMLElement;
    private submitBtn: HTMLElement;
    private dismissBtn: HTMLElement;
    private title: HTMLElement;
    private textContainer: HTMLElement;

    private submitCallback: Function;
    private dismissCallback: Function;



    constructor(type: string, submitText: string, dismissText: string, title: string, textContent: string[], submitCallback: Function, dismissCallback?: Function) {

        let container               = document.createElement( "div" );
        container.id                = "confirmation-modal-container";

        container.innerHTML         = template;
        document.body.appendChild( container );

        this.modalBackground        = document.getElementById( "confirmation-modal-background" );
        this.modal                  = document.getElementById( "confirmation-modal" );
        this.icon                   = document.getElementById( "confirmation-modal-icon" );
        this.closeBtn               = document.getElementById( "confirmation-modal-close-btn" );
        this.submitBtn              = document.getElementById( "confirmation-modal-submit-btn" );
        this.dismissBtn             = document.getElementById( "confirmation-modal-dismiss-btn" );
        this.title                  = document.getElementById( "confirmation-modal-title" );
        this.textContainer          = document.getElementById( "confirmation-modal-text-container" );

        this.submitBtn.innerText    = submitText;
        this.dismissBtn.innerText   = dismissText;
        this.icon.classList.add( type );
        this.title.innerText        = title;

        this.injectTextContent( textContent );

        this.submitCallback         = submitCallback;

        if ( dismissCallback ) this.dismissCallback = dismissCallback;

        this.submitListener         = this.submitListener.bind( this );
        this.dismissListener        = this.dismissListener.bind( this );


        this.enterScene();

    }



    private registerEventListeners(): void {
        this.submitBtn.addEventListener( "click", this.submitListener );
        this.dismissBtn.addEventListener( "click", this.dismissListener );
    }



    private unregisterEventListeners(): void {
        this.submitBtn.removeEventListener( "click", this.submitListener );
        this.dismissBtn.removeEventListener( "click", this.dismissListener );
    }



    private submitListener(): void {
        if ( this.submitCallback ) this.submitCallback();

        this.exitScene();
    }
    


    private dismissListener(): void {
        if ( this.dismissCallback ) this.dismissCallback();

        this.exitScene();
    }
    


    private injectTextContent(textContent: string[]): void {

        for ( let text of textContent ) {

            let p = document.createElement( "p" );
            p.innerHTML = text;

            this.textContainer.appendChild( p );
        }
    }



    private enterScene(): void {
        this.registerEventListeners();
        this.modalBackground.style.opacity = "1";
    }



    private exitScene(): void {
        this.unregisterEventListeners();
        this.modalBackground.parentNode.removeChild( this.modalBackground );
    }



    public onSubmit(callback: Function): void {
        this.submitCallback = callback;
    }



    public onDismiss(callback: Function): void {
        this.dismissCallback = callback;
    }

}
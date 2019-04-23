
import TweenLite = gsap.TweenLite;
import Power0 = gsap.Power0;
import Back = gsap.Back;


import "../style/style-sheets/confirmation-modal.scss";

const template = require( "../templates/confirmation-modal.html" );



export class ConfirmationModal {

    private container: HTMLElement;
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



    constructor(type: string, submitText: string, dismissText: string, title: string, textContent: string[], submitCallback?: Function, dismissCallback?: Function) {

        this.container              = document.createElement( "div" );
        this.container.id           = "confirmation-modal-container";

        this.container.innerHTML    = template;
        document.body.appendChild( this.container );

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

        if ( submitCallback ) this.submitCallback   = submitCallback;

        if ( dismissCallback ) this.dismissCallback = dismissCallback;

        this.submitListener         = this.submitListener.bind( this );
        this.dismissListener        = this.dismissListener.bind( this );
        this.documentKeyListener         = this.documentKeyListener.bind( this );
        this.modalClickListener     = this.modalClickListener.bind( this );

        this.enterScene();

    }



    private registerEventListeners(): void {
        this.submitBtn.addEventListener( "click", this.submitListener );
        this.dismissBtn.addEventListener( "click", this.dismissListener );
        this.closeBtn.addEventListener( "click", this.dismissListener );
        this.modalBackground.addEventListener( "click", this.dismissListener );
        this.modal.addEventListener( "click", this.modalClickListener );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.submitBtn.removeEventListener( "click", this.submitListener );
        this.dismissBtn.removeEventListener( "click", this.dismissListener );
        this.closeBtn.removeEventListener( "click", this.dismissListener );
        this.modalBackground.removeEventListener( "click", this.dismissListener );
        this.modal.removeEventListener( "click", this.modalClickListener );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private submitListener(): void {
        if ( this.submitCallback ) this.submitCallback();

        this.exitScene();
    }



    private dismissListener(): void {
        if ( this.dismissCallback ) this.dismissCallback();

        this.exitScene();
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.dismissListener(); // ESCAPE

        if ( key === 13 ) this.submitListener(); // ENTER
    }



    private modalClickListener(e: any): void {
        e.stopPropagation();
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

        TweenLite.to( this.modalBackground, 0.15, { opacity: 1 } );

        TweenLite.to( this.modal,
            0.3,
            {
                opacity: 1
            });

        TweenLite.to( this.modal,
            0.2,
            {
                marginTop: 150,
                opacity: 1
            });
    }



    private exitScene(): void {
        this.unregisterEventListeners();

        TweenLite.to( this.modalBackground, 0.3, { opacity: 0 } );

        TweenLite.to( this.modal, 0.3, { opacity: 0 } );

        TweenLite.to( this.modal,
            0.2,
            {
                marginTop: 200,
                opacity: 0
            });

        setTimeout( () => {
            this.container.parentNode.removeChild( this.container );
        }, 300 );

    }



    public onSubmit(callback: Function): ConfirmationModal {
        this.submitCallback = callback;
        return this;
    }



    public onDismiss(callback: Function): ConfirmationModal {
        this.dismissCallback = callback;
        return this;
    }

}
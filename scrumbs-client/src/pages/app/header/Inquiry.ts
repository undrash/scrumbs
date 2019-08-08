

import {InquiryType} from "../../../connection/models/constants/InquiryType";
import {CreateInquiryModel} from "../../../connection/CreateInquiryModel";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {View} from "../../../core/View";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;


// CSS
import "../../../style/style-sheets/header-inquiry.scss";


// HTML
const template = require( "../../../templates/header-inquiry.html" );






export class Inquiry extends ViewComponent {
    private overlay: HTMLElement;

    private modal: HTMLElement;

    private submitContainer: HTMLElement;
    private successContainer: HTMLElement;
    private failureContainer: HTMLElement;

    private closeBtn: HTMLElement;
    private submitBtn: HTMLElement;

    private select: HTMLElement;
    private selectText: HTMLElement;
    private selectArrow: HTMLElement;

    private dropdown: HTMLElement;
    private optionBug: HTMLElement;
    private optionRequest: HTMLElement;

    private titleInput: HTMLInputElement;
    private descriptionInput: HTMLInputElement;

    private selectError: HTMLElement;
    private titleError: HTMLElement;
    private descriptionError: HTMLElement;

    private inquirySuccessType: HTMLElement;

    private inquiryFailedMessage: HTMLElement;

    private inquiryType: InquiryType;



    constructor(view: View, container: HTMLElement) {
        super( view, container, "Inquiry" );

        this.container.innerHTML    = template;

        this.overlay                = document.getElementById( "inquiry-overlay" );

        this.modal                  = document.getElementById( "inquiry-modal" );

        this.submitContainer        = document.getElementById( "inquiry-submit-container" );
        this.successContainer       = document.getElementById( "inquiry-success-container" );
        this.failureContainer       = document.getElementById( "inquiry-failed-container" );

        this.closeBtn               = document.getElementById( "inquiry-modal-close-btn" );
        this.submitBtn              = document.getElementById( "inquiry-submit-btn" );

        this.select                 = document.getElementById( "inquiry-select-dropdown-head" );
        this.selectText             = document.getElementById( "inquiry-selected" );
        this.selectArrow            = document.getElementById( "inquiry-dropdown-btn" );

        this.dropdown               = document.getElementById( "inquiry-select-dropdown-body" );
        this.optionBug              = document.getElementById( "inquiry-option-bug" );
        this.optionRequest          = document.getElementById( "inquiry-option-feature" );

        this.titleInput             = document.getElementById( "inquiry-modal-title-input" ) as HTMLInputElement;
        this.descriptionInput       = document.getElementById( "inquiry-modal-description-input" ) as HTMLInputElement;

        this.selectError            = document.getElementById( "inquiry-select-error" );
        this.titleError             = document.getElementById( "inquiry-title-error" );
        this.descriptionError       = document.getElementById( "inquiry-description-error" );

        this.inquirySuccessType     = document.getElementById( "inquiry-success-type" );

        this.inquiryFailedMessage   = document.getElementById( "inquiry-modal-error-message" );

        this.modalClickListener     = this.modalClickListener.bind( this );
        this.submit                 = this.submit.bind( this );
        this.dismiss                = this.dismiss.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );
        this.showDropdown           = this.showDropdown.bind( this );
        this.hideDropdown           = this.hideDropdown.bind( this );
    }



    private registerEventListeners(): void {
        this.modal.addEventListener( "click", this.modalClickListener );
        this.submitBtn.addEventListener( "click", this.submit );
        this.closeBtn.addEventListener( "click", this.dismiss );
        this.overlay.addEventListener( "click", this.dismiss );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.modal.removeEventListener( "click", this.modalClickListener );
        this.submitBtn.removeEventListener( "click", this.submit );
        this.closeBtn.removeEventListener( "click", this.dismiss );
        this.overlay.removeEventListener( "click", this.dismiss );
        document.removeEventListener( "keydown", this.documentKeyListener );

    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.dismiss(); // ESCAPE

        if ( key === 13 ) this.submit(); // ENTER
    }



    private submit(): void {
        console.log( "submit clicked" );
        // this.exitScene( ViewExitTypes.HIDE_COMPONENT );


        if ( ! this.validateInputs() ) return;

        console.log( "Creating inquiry, inquiry type: ", this.inquiryType );

        const inquiry = new CreateInquiryModel(
            this.inquiryType,
            this.titleInput.value,
            this.descriptionInput.value
        );

        this.connection.createInquiry(
            inquiry,
            (response: any) => {
                if ( this.inquiryType === InquiryType.BUG_REPORT ) this.inquirySuccessType.innerText = "bug report";
                if ( this.inquiryType === InquiryType.FEATURE_REQUEST ) this.inquirySuccessType.innerText = "feature request";

                this.submitContainer.style.display = "none";

                this.successContainer.style.display = "block";

                console.log( response );

            },
            (err: any) => {

                this.inquiryFailedMessage.innerText = err.error;
                this.submitContainer.style.display  = "none";
                this.failureContainer.style.display = "block";

                console.error( err );
            }
        )
    }




    private dismiss(): void {
        this.exitScene( ViewExitTypes.HIDE_COMPONENT )
    }



    private modalClickListener(e: any): void {
        e.stopPropagation();


        switch ( e.target.id ) {

            case this.select.id :
            case this.selectArrow.id :
            case this.selectText.id :

                this.showDropdown();

                break;

            case this.optionBug.id :

                this.inquiryType                = InquiryType.BUG_REPORT;
                this.selectText.innerText       = e.target.innerText;
                this.selectError.style.display  = "none";
                this.hideDropdown();

                break;

            case this.optionRequest.id :

                this.inquiryType                = InquiryType.FEATURE_REQUEST;
                this.selectText.innerText       = e.target.innerText;
                this.selectError.style.display  = "none";
                this.hideDropdown();

                break;

            case this.titleInput.id :
                this.titleError.style.display = "none";
                this.hideDropdown();

                break;

            case this.descriptionInput.id :
                this.descriptionError.style.display = "none";
                this.hideDropdown();

                break;

            default :
                this.hideDropdown();
                break;
        }

    }



    private showDropdown(): void {
        this.dropdown.style.display = "block";
    }



    private hideDropdown(): void {
        this.dropdown.style.display = "none";
    }



    private validateInputs(): boolean {
        let valid = true;

        if ( this.inquiryType !== InquiryType.BUG_REPORT &&
             this.inquiryType !== InquiryType.FEATURE_REQUEST ) {
            this.selectError.style.display = "block";
            valid = false;
        }

        if ( ! this.titleInput.value ) {
            this.titleError.style.display = "block";
            valid = false;
        }


        if ( this.descriptionInput.value.length < 10 ) {
            this.descriptionError.style.display = "block";
            valid = false;
        }


        return valid;
    }



    private resetModal(): void {
        this.hideDropdown();
        this.inquiryType                    = null;
        this.selectText.innerText           = "Select an option";
        this.titleInput.value               = null;
        this.descriptionInput.value         = null;

        this.selectError.style.display      = "none";
        this.titleError.style.display       = "none";
        this.descriptionError.style.display = "none";

        this.successContainer.style.display = "none";
        this.failureContainer.style.display = "none";
        this.submitContainer.style.display  = "block";

        this.inquiryFailedMessage.innerText = "Error 500 | Internal server error";
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in view component" );
        this.registerEventListeners();

        this.container.style.display = "block";


        switch ( enterType ) {

            case ViewEnterTypes.REVEAL_COMPONENT :

                TweenLite.to( this.overlay, 0.15, { opacity: 1 } );

                TweenLite.to( this.modal,
                    0.3,
                    {
                        opacity: 1
                    });

                TweenLite.to( this.modal,
                    0.2,
                    {
                        marginTop: 200,
                        opacity: 1
                    });


                break;

            default :
                break;

        }
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in view component" );
        this.unregisterEventListeners();

        switch ( exitType ) {

            case ViewExitTypes.HIDE_COMPONENT :

                TweenLite.to( this.overlay, 0.3, { opacity: 0 } );

                TweenLite.to( this.modal, 0.3, { opacity: 0 } );

                TweenLite.to( this.modal,
                    0.2,
                    {
                        marginTop: 150,
                        opacity: 0
                    });

                setTimeout( () => {
                    this.container.style.display = "none";
                    this.resetModal();
                }, 300 );

                break;

            default :

                super.exitScene( exitType );

                this.view.componentExited( this.name );
                break;
        }

    }
}


import {UpdateUserModel} from "../../../connection/models/UpdateUserModel";
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {ValidationHelper} from "../../../helpers/ValidationHelper";
import {AccountSettings} from "./AccountSettings";
import {UserVO} from "../../../connection/UserVO";
import {SnackBar} from "../../../common/SnackBar";
import {SnackBarType} from "../../../common/SnackBarType";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require("../../../templates/account-settings-change-email-modal.html" );



export class ChangeEmailModal {

    private container: HTMLElement;
    private component: AccountSettings;
    private connection: ConnectionProxy;
    private snackbar: SnackBar;

    private modal: HTMLElement;
    private exitBtn: HTMLElement;
    private cancelBtn: HTMLElement;
    private saveBtn: HTMLElement;

    private currentEmail: HTMLElement;
    private emailInput: HTMLInputElement;
    private emailError: HTMLElement;
    private passwordInput: HTMLInputElement;
    private passwordError: HTMLElement;

    constructor(component: AccountSettings) {

        this.component              = component;
        this.connection             = new ConnectionProxy( "ChangeEmailModal" );
        this.snackbar               = SnackBar._instance;

        this.container              = document.createElement( "div" );
        this.container.id           = "account-settings-change-email-modal";
        this.container.className    = "modal-overlay";

        this.container.innerHTML    = template;

        this.exitBtn                = this.container.querySelector( "#account-settings-change-email-modal-exit-btn" ) as HTMLElement;
        this.modal                  = this.container.querySelector( "#account-settings-change-email-modal-bg" ) as HTMLElement;
        this.cancelBtn              = this.container.querySelector( "#account-settings-change-email-modal-cancel-btn" ) as HTMLElement;
        this.saveBtn                = this.container.querySelector( "#account-settings-change-email-modal-save-btn" ) as HTMLElement;

        this.currentEmail           = this.container.querySelector( "#account-settings-user-current-email" ) as HTMLElement;
        this.emailInput             = this.container.querySelector( "#account-settings-change-email-modal-email-input" ) as HTMLInputElement;
        this.emailError             = this.container.querySelector( "#account-settings-change-email-modal-email-input-error-msg" ) as HTMLElement;
        this.passwordInput          = this.container.querySelector( "#account-settings-change-email-modal-password-input" ) as HTMLInputElement;
        this.passwordError          = this.container.querySelector( "#account-settings-change-email-modal-password-input-error-msg" ) as HTMLElement;


        this.overlayClickListener   = this.overlayClickListener.bind( this );
        this.saveListener           = this.saveListener.bind( this );
        this.resetAndExit           = this.resetAndExit.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );
        this.inputFocusHandler      = this.inputFocusHandler.bind( this );

    }



    private registerEventListeners(): void {
        this.saveBtn.addEventListener( "click", this.saveListener );
        this.exitBtn.addEventListener( "click", this.resetAndExit );
        this.cancelBtn.addEventListener( "click", this.resetAndExit );
        this.container.addEventListener( "click", this.overlayClickListener );
        this.emailInput.addEventListener( "focus", this.inputFocusHandler );
        this.passwordInput.addEventListener( "focus", this.inputFocusHandler );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.saveBtn.removeEventListener( "click", this.saveListener );
        this.exitBtn.removeEventListener( "click", this.resetAndExit );
        this.cancelBtn.removeEventListener( "click", this.resetAndExit );
        this.container.removeEventListener( "click", this.overlayClickListener );
        this.emailInput.removeEventListener( "focus", this.inputFocusHandler );
        this.passwordInput.removeEventListener( "focus", this.inputFocusHandler );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.resetAndExit(); // ESCAPE
    }



    private inputFocusHandler(e: any): void {

        switch ( e.target.id ) {

            case this.emailInput.id :
                this.emailError.style.opacity = "0";
                break;

            case this.passwordInput.id :
                this.passwordError.style.opacity = "0";
                break;

            default :
                break;
        }
    }


    public saveListener(): void {

        if ( ! this.areInputsValid() ) return;

        const model = new UpdateUserModel(
            null,
            this.emailInput.value,
            null,
            this.passwordInput.value,
        );

        this.connection.updateUser(
            model,
            (response: any) => {
                const { user, name, email, onboardingGuidesDisplayed } = response;

                ConnectionProxy.setVO(
                    new UserVO(
                        user,
                        name,
                        email,
                        onboardingGuidesDisplayed
                    )
                );

                this.component.emailUpdated( email );

                this.resetAndExit();
            },
            (err: Error) => this.snackbar.show( SnackBarType.ERROR, err.message )
        );


    }



    private overlayClickListener(e: any): void {
        if ( e.target.id === this.container.id ) this.resetAndExit();
    }



    private areInputsValid(): boolean {

        let areValid = true;

        if ( ! ValidationHelper.validateEmail( this.emailInput.value ) ) {
            this.emailError.style.opacity = "1";
            areValid = false;
        }

        if ( this.passwordInput.value.length < 5 ) {
            this.passwordError.style.opacity = "1";
            areValid = false;
        }

        return areValid;
    }



    private populate(): void {
        const vo = this.connection.getVO();
        this.currentEmail.innerText = vo.email;
    }



    public resetAndExit(): void {

        this.currentEmail.innerText         = '';
        this.emailInput.value               = '';
        this.passwordInput.value            = '';

        this.emailError.style.opacity       = '0';
        this.passwordError.style.opacity    = '0';

        this.exitScene();
    }



    public enterScene(): void {
        this.registerEventListeners();
        this.populate();

        document.body.appendChild( this.container );

        TweenLite.to( this.container, 0.15, { opacity: 1 } );

        TweenLite.to( this.modal,
            0.3,
            {
                opacity: 1
            });

        TweenLite.to( this.modal,
            0.2,
            {
                marginTop: 90,
                opacity: 1
            });
    }



    private exitScene(): void {
        this.unregisterEventListeners();
        TweenLite.to( this.container, 0.3, { opacity: 0 } );

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

        this.component.modalExited();
    }

}


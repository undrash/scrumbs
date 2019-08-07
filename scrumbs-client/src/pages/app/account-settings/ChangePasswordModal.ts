
import {UpdateUserModel} from "../../../connection/models/UpdateUserModel";
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {SnackBarType} from "../../../common/SnackBarType";
import {AccountSettings} from "./AccountSettings";
import {SnackBar} from "../../../common/SnackBar";

declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;

const template = require("../../../templates/account-settings-change-password-modal.html" );



export class ChangePasswordModal {

    private container: HTMLElement;
    private component: AccountSettings;
    private connection: ConnectionProxy;
    private snackbar: SnackBar;

    private modal: HTMLElement;
    private exitBtn: HTMLElement;
    private cancelBtn: HTMLElement;
    private saveBtn: HTMLElement;

    private newPasswordInput: HTMLInputElement;
    private oldPasswordInput: HTMLInputElement;

    private newPassError: HTMLElement;
    private oldPassError: HTMLElement;


    constructor(component: AccountSettings) {

        this.component              = component;
        this.connection             = new ConnectionProxy( "ChangePasswordModal" );
        this.snackbar               = SnackBar._instance;

        this.container              = document.createElement( "div" );
        this.container.id           = "account-settings-change-password-modal";
        this.container.className    = "modal-overlay";

        this.container.innerHTML    = template;

        this.exitBtn                = this.container.querySelector( "#account-settings-change-password-modal-exit-btn" ) as HTMLElement;
        this.modal                  = this.container.querySelector( "#account-settings-change-password-modal-bg" ) as HTMLElement;
        this.cancelBtn              = this.container.querySelector( "#account-settings-change-password-modal-cancel-btn" ) as HTMLElement;
        this.saveBtn                = this.container.querySelector( "#account-settings-change-password-modal-save-btn" ) as HTMLElement;

        this.newPasswordInput       = this.container.querySelector( "#account-settings-change-password-modal-new-password-input" ) as HTMLInputElement;
        this.oldPasswordInput       = this.container.querySelector( "#account-settings-change-password-modal-current-password-input" ) as HTMLInputElement;

        this.newPassError           = this.container.querySelector( "#account-settings-change-password-modal-new-password-input-error-msg" ) as HTMLElement;
        this.oldPassError           = this.container.querySelector( "#account-settings-change-password-modal-current-password-inputerror-msg" ) as HTMLElement;

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
        this.newPasswordInput.addEventListener( "focus", this.inputFocusHandler );
        this.oldPasswordInput.addEventListener( "focus", this.inputFocusHandler );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.saveBtn.removeEventListener( "click", this.saveListener );
        this.exitBtn.removeEventListener( "click", this.resetAndExit );
        this.cancelBtn.removeEventListener( "click", this.resetAndExit );
        this.container.removeEventListener( "click", this.overlayClickListener );
        this.newPasswordInput.removeEventListener( "focus", this.inputFocusHandler );
        this.oldPasswordInput.removeEventListener( "focus", this.inputFocusHandler );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private inputFocusHandler(e: any): void {

        switch ( e.target.id ) {

            case this.newPasswordInput.id :
                this.newPassError.style.opacity = '0';
                break;

            case this.oldPasswordInput.id :
                this.oldPassError.style.opacity = '0';
                break;

            default :
                break;
        }
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.resetAndExit(); // ESCAPE
    }



    public saveListener(): void {

        if ( ! this.areInputsValid() ) return;

        const model = new UpdateUserModel(
            null,
            null,
            this.newPasswordInput.value,
            this.oldPasswordInput.value
        );


        this.connection.updateUser(
            model,
            () => {

                this.resetAndExit();
            },
            (err: Error) => this.snackbar.show( SnackBarType.ERROR, err.message )
        );
    }



    private overlayClickListener(e: any): void {

        console.log( e.target.id );
        if ( e.target.id === this.container.id ) this.resetAndExit();
    }



    private areInputsValid(): boolean {
        let areValid = true;

        if ( this.newPasswordInput.value.length < 5 ) {
            this.newPassError.style.opacity = '1';
            areValid = false;
        }

        if ( this.oldPasswordInput.value.length < 5 ) {
            this.oldPassError.style.opacity = '1';
            areValid = false;
        }

        return areValid;
    }



    public resetAndExit(): void {

        this.newPassError.style.opacity     = '0';
        this.oldPassError.style.opacity     = '0';

        this.newPasswordInput.value         = '';
        this.oldPasswordInput.value         = '';

        this.exitScene();
    }



    public enterScene(): void {
        this.registerEventListeners();

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

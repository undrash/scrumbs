
import {CreateTeamModel} from "../../../connection/models/CreateTeamModel";
import {UpdateUserModel} from "../../../connection/models/UpdateUserModel";
import {ConnectionProxy} from "../../../connection/ConnectionProxy";
import {ConfirmationModal} from "../../../common/ConfirmationModal";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ChangePasswordModal} from "./ChangePasswordModal";
import {ModalTypes} from "../../../common/ModalTypes";
import {ChangeEmailModal} from "./ChangeEmailModal";
import {UserVO} from "../../../connection/UserVO";
import {AccountSignals} from "./AccountSignals";
import {View} from "../../../core/View";


declare const TweenLite: any;
declare const Power0: any;
declare const Back: any;


declare const SimpleBar: any;


// HTML
const template = require( "../../../templates/account-settings.html" );






export class AccountSettings extends ViewComponent {
    private body: HTMLElement;
    private nameInput: HTMLInputElement;
    private emailInput: HTMLInputElement;

    private changeEmailBtn: HTMLElement;
    private changePasswordBtn: HTMLElement;
    private deleteAccountBtn: HTMLElement;

    private exitBtn: HTMLElement;

    private nameInputTimer: any;


    private changeEmailModal: ChangeEmailModal;
    private changePasswordModal: ChangePasswordModal;


    constructor(view: View, container: HTMLElement) {
        super( view, container, "AccountSettings" );

        this.container.innerHTML    = template;

        this.body                   = document.getElementById( "account-settings-body-container" );

        new SimpleBar( this.body );

        this.nameInput              = document.getElementById( "account-settings-name-input" ) as HTMLInputElement;
        this.emailInput             = document.getElementById( "account-settings-email-input" ) as HTMLInputElement;

        this.changeEmailBtn         = document.getElementById( "account-settings-change-email-btn" );
        this.changePasswordBtn      = document.getElementById( "account-settings-change-password-btn" );
        this.deleteAccountBtn       = document.getElementById( "account-settings-delete-account-btn" );

        this.exitBtn                = document.getElementById( "account-settings-exit-btn" );

        this.changeEmailModal       = new ChangeEmailModal( this );
        this.changePasswordModal    = new ChangePasswordModal( this );


        this.exitBtnHandler         = this.exitBtnHandler.bind( this );
        this.nameInputListener      = this.nameInputListener.bind( this );
        this.documentKeyListener    = this.documentKeyListener.bind( this );
        this.deleteBtnHandler       = this.deleteBtnHandler.bind( this );
        this.changeEmailHandler     = this.changeEmailHandler.bind( this );
        this.changePasswordHandler  = this.changePasswordHandler.bind( this );

        this.enterScene();
    }



    private registerEventListeners(): void {
        this.exitBtn.addEventListener( "click", this.exitBtnHandler );
        this.nameInput.addEventListener( "keyup", this.nameInputListener );
        this.deleteAccountBtn.addEventListener( "click", this.deleteBtnHandler );
        this.changeEmailBtn.addEventListener( "click", this.changeEmailHandler  );
        this.changePasswordBtn.addEventListener( "click", this.changePasswordHandler  );
        document.addEventListener( "keydown", this.documentKeyListener );
    }



    private unregisterEventListeners(): void {
        this.exitBtn.removeEventListener( "click", this.exitBtnHandler );
        this.nameInput.removeEventListener( "keyup", this.nameInputListener );
        this.deleteAccountBtn.removeEventListener( "click", this.deleteBtnHandler );
        this.changeEmailBtn.removeEventListener( "click", this.changeEmailHandler  );
        this.changePasswordBtn.removeEventListener( "click", this.changePasswordHandler  );
        document.removeEventListener( "keydown", this.documentKeyListener );
    }



    private changeEmailHandler(): void {
        this.changeEmailModal.enterScene();
        this.sendSignal( AccountSignals.FOREGROUND_ACTIVE );
    }



    private changePasswordHandler(): void {
        this.changePasswordModal.enterScene();
        this.sendSignal( AccountSignals.FOREGROUND_ACTIVE );
    }



    private documentKeyListener(e: any): void {
        const key = e.which || e.keyCode;

        if ( key === 27 ) this.sendSignal( AccountSignals.EXIT ); // ESCAPE
    }



    private exitBtnHandler(): void {
        this.sendSignal( AccountSignals.EXIT );
    }



    private deleteBtnHandler(): void {

        const email = this.connection.getVO().email;

        new ConfirmationModal(
            ModalTypes.DELETE,
            "Yes, Delete Account",
            "Cancel, Keep My Account",
            "WARNING! Deleting Account!",
            [
                `Are you sure you want to delete the account associated with the <strong>${ email }</strong> email address?`,
                "<br><strong>All your data will be permanently deleted, and the operation cannot be undone.</strong>"
            ]
        )
            .onSubmit( () => {

                this.connection.deleteUser(
                    () => document.location.reload( true ),
                    () => {}
                );

            });

    }



    private nameInputListener(): void {

        if ( this.nameInputTimer ) clearTimeout( this.nameInputTimer );

        const data = new UpdateUserModel(
            this.nameInput.value,
            null,
            null,
            null
        );

        this.nameInputTimer = setTimeout( () => {

            this.connection.updateUser(
                data,
                (response: any) => {
                    const {  name, email, onboardingGuidesDisplayed } = response;

                    ConnectionProxy.setVO(
                        new UserVO(
                            name,
                            email,
                            onboardingGuidesDisplayed
                        )
                    );

                    this.sendSignal( AccountSignals.ACCOUNT_UPDATED );
                },
                (err: Error) => console.error( err )
            );

        }, 250 );
    }



    public modalExited(): void {
        this.sendSignal( AccountSignals.FOREGROUND_INACTIVE );
    }



    public emailUpdated(email: string): void {
        this.emailInput.value = email;
    }


    private populate(): void {

        const vo = this.connection.getVO();

        this.nameInput.value    = vo.name;
        this.emailInput.value   = vo.email;

    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in account settings view component" );
        this.populate();
        this.registerEventListeners();
    }



    public exitScene(exitType?: string): void {
        console.info( "Exit being called in account settings view component" );

        super.exitScene( exitType );
        this.unregisterEventListeners();
        this.view.componentExited( this.name );
    }

}

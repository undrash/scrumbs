

import {ViewEnterTypes} from "../core/ViewEnterTypes";
import {ViewExitTypes} from "../core/ViewExitTypes";
import {ViewComponent} from "../core/ViewComponent";
import {View} from "../core/View";


import TweenLite = gsap.TweenLite;
import Power1 = gsap.Power1;
import Back = gsap.Back;


// CSS
import "../_style/style-sheets/authentication-sign-up.scss";
import {ValidationHelper} from "../helpers/ValidationHelper";
import {SignUpModel} from "../connection/models/SignUpModel";
import {AuthenticationSignals} from "./AuthenticationSignals";


// HTML
const template = require( "../_view-templates/authentication/component/authentication-sign-up.html" );






export class AuthenticationSignUp extends ViewComponent {

    private title: HTMLHeadingElement;
    private subTitle: HTMLHeadingElement;

    private nameInputLabel: HTMLLabelElement;
    private nameInput: HTMLInputElement;
    private nameInputError: HTMLSpanElement;

    private emailInputLabel: HTMLLabelElement;
    private emailInput: HTMLInputElement;
    private emailInputError: HTMLSpanElement;

    private passwordInputLabel: HTMLLabelElement;
    private passwordInput: HTMLInputElement;
    private passwordInputError: HTMLSpanElement;

    private signUpBtn: HTMLButtonElement;

    private passwordInputTypeToggle: HTMLSpanElement;


    constructor(view: View, container: HTMLElement) {
        super( view, container );

        this.container.innerHTML = template;

        this.title                      = document.getElementById( "authentication-sign-up-title" ) as HTMLHeadingElement;
        this.subTitle                   = document.getElementById( "authentication-sign-up-subtitle" ) as HTMLHeadingElement;

        this.nameInputLabel             = document.getElementById( "authentication-sign-up-name-label" ) as HTMLLabelElement;
        this.nameInput                  = document.getElementById( "authentication-sign-up-name-input" ) as HTMLInputElement;
        this.nameInputError             = document.getElementById( "authentication-sign-up-name-input-error" ) as HTMLSpanElement;

        this.emailInputLabel            = document.getElementById( "authentication-sign-up-email-label" ) as HTMLLabelElement;
        this.emailInput                 = document.getElementById( "authentication-sign-up-email-input" ) as HTMLInputElement;
        this.emailInputError            = document.getElementById( "authentication-sign-up-email-input-error" ) as HTMLSpanElement;

        this.passwordInputLabel         = document.getElementById( "authentication-sign-up-email-input-label" ) as HTMLLabelElement;
        this.passwordInput              = document.getElementById( "authentication-sign-up-password-input" ) as HTMLInputElement;
        this.passwordInputError         = document.getElementById( "authentication-sign-up-password-input-error" ) as HTMLSpanElement;

        this.signUpBtn                  = document.getElementById( "authentication-sign-up-btn" ) as HTMLButtonElement;

        this.passwordInputTypeToggle    = document.getElementById( "authentication-sign-up-password-toggle-button" ) as HTMLSpanElement;

        this.nameInputListener                  = this.nameInputListener.bind( this );
        this.emailInputListener                 = this.emailInputListener.bind( this );
        this.passwordInputListener              = this.passwordInputListener.bind( this );
        this.signUpBtnListener                  = this.signUpBtnListener.bind( this );
        this.passwordInputTypeToggleListener    = this.passwordInputTypeToggleListener.bind( this );

        this.enterScene();

    }



    private registerEventListeners(): void {
        this.nameInput.addEventListener( "focus", this.nameInputListener );
        this.emailInput.addEventListener( "focus", this.emailInputListener );
        this.passwordInput.addEventListener( "focus", this.passwordInputListener );
        this.signUpBtn.addEventListener( "click", this.signUpBtnListener );
        this.passwordInputTypeToggle.addEventListener( "click", this.passwordInputTypeToggleListener );
    }



    private unregisterEventListeners(): void {
        this.nameInput.removeEventListener( "focus", this.nameInputListener );
        this.emailInput.removeEventListener( "focus", this.emailInputListener );
        this.passwordInput.removeEventListener( "focus", this.passwordInputListener );
        this.signUpBtn.removeEventListener( "click", this.signUpBtnListener );
        this.passwordInputTypeToggle.removeEventListener( "click", this.passwordInputTypeToggleListener );

    }



    private nameInputListener(e: any) {
        this.nameInputError.style.display = "none";
    }



    private emailInputListener(e: any) {
        this.emailInputError.style.display = "none";
    }



    private passwordInputListener(e: any) {
        this.passwordInputError.style.display = "none";
    }



    private signUpBtnListener(e: any) {
        if ( ! this.validateInputs() ) return;

        const name = this.nameInput.value;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        const signUpModel = new SignUpModel( name, email, password );

        this.connection.signUp(
            signUpModel,
            () => this.sendSignal( AuthenticationSignals.SIGN_UP ),
            (err: string) => console.error( err )
        )

    }



    private passwordInputTypeToggleListener(e: any) {
        this.passwordInput.type === "text" ? this.passwordInput.type = "password" : this.passwordInput.type = "text";
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in authentication sign up view component" );

        if ( enterType === ViewEnterTypes.SWITCH_COMPONENT ) {

            this.container.style.display = "block";

            TweenLite.to( this.container, 0.8, { opacity: 1 } );

            TweenLite.to( this.container, 0.5, { paddingTop: 60,  ease: Back.easeOut.config( 0.35 ) } );

        } else {
            this.registerEventListeners();
        }

    }



    public exitScene(exitType: string, signal?: string): void {
        console.info( "Exit being called in authentication sign up view component" );

        if ( exitType === ViewExitTypes.SWITCH_COMPONENT ) {

            TweenLite.to( this.container, 0.4, { paddingTop: 130 } );

            TweenLite.to( this.container, 0.4, { opacity: 0, ease: Power1.easeOut, onComplete: () => {
                this.container.style.display = "none";
                if ( signal ) this.sendSignal( signal );
            }});

        } else {
            super.exitScene( exitType );
            this.unregisterEventListeners();
            this.view.componentExited( this.name );

        }
    }



    private validateInputs(): boolean {
        const name: string              = this.nameInput.value;
        const email: string             = this.emailInput.value;
        const isEmailValid: boolean     = ValidationHelper.validateEmail( email );
        const password: string          = this.passwordInput.value;

        if ( ! name )           this.nameInputError.style.display           = "block";
        if ( ! isEmailValid )   this.emailInputError.style.display          = "block";
        if ( ! password )       this.passwordInputError.style.display       = "block";

        return isEmailValid && password !== "" && name !== "";
    }

}
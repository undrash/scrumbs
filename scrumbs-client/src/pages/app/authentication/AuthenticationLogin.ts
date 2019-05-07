
import {AuthenticationSignals} from "./AuthenticationSignals";
import {ValidationHelper} from "../../../helpers/ValidationHelper";
import {LoginModel} from "../../../connection/models/LoginModel";
import {ViewEnterTypes} from "../../../core/ViewEnterTypes";
import {ViewExitTypes} from "../../../core/ViewExitTypes";
import {ViewComponent} from "../../../core/ViewComponent";
import {View} from "../../../core/View";

import TweenLite = gsap.TweenLite;
import Power1 = gsap.Power1;
import Back = gsap.Back;


// CSS
import "../../../style/style-sheets/authentication-log-in.scss";


// HTML
const template = require( "../../../templates/authentication-log-in.html" );






export class AuthenticationLogin extends ViewComponent {

    private title: HTMLHeadingElement;
    private subTitle: HTMLHeadingElement;

    private emailInputLabel: HTMLLabelElement;
    private emailInput: HTMLInputElement;
    private emailInputError: HTMLSpanElement;

    private passwordInputLabel: HTMLLabelElement;
    private passwordInput: HTMLInputElement;
    private passwordInputError: HTMLSpanElement;

    private rememberMe: HTMLInputElement;
    private forgotPassBtn: HTMLParagraphElement;
    private loginBtn: HTMLButtonElement;

    private passwordInputTypeToggle: HTMLSpanElement;



    constructor(view: View, container: HTMLElement) {
        super( view, container, "AuthenticationLogin" );

        console.info( "Login view component initialized." );

        this.container.innerHTML = template;

        this.title                  = document.getElementById( "authentication-login-title" ) as HTMLHeadingElement;
        this.subTitle               = document.getElementById( "authentication-login-subtitle" ) as HTMLHeadingElement;

        this.emailInputLabel        = document.getElementById( "authentication-login-email-input-label" ) as HTMLLabelElement;
        this.emailInput             = document.getElementById( "authentication-login-email-input" ) as HTMLInputElement;
        this.emailInputError        = document.getElementById( "authentication-login-email-input-error" ) as HTMLSpanElement;

        this.passwordInputLabel     = document.getElementById( "authentication-login-password-input-label" ) as HTMLLabelElement;
        this.passwordInput          = document.getElementById( "authentication-login-password-input" ) as HTMLInputElement;
        this.passwordInputError     = document.getElementById( "authentication-login-password-input-error" ) as HTMLSpanElement;

        this.rememberMe             = document.getElementById( "remember-me" ) as HTMLInputElement;
        this.forgotPassBtn          = document.getElementById( "authentication-login-forgot-password" ) as HTMLParagraphElement;
        this.loginBtn               = document.getElementById( "authentication-login-btn" ) as HTMLButtonElement;

        this.passwordInputTypeToggle               = document.getElementById( "authentication-login-password-toggle-button" ) as HTMLSpanElement;



        this.emailInputListener                 = this.emailInputListener.bind( this );
        this.passwordInputListener              = this.passwordInputListener.bind( this );
        this.forgotPassBtnListener              = this.forgotPassBtnListener.bind( this );
        this.loginBtnListener                   = this.loginBtnListener.bind( this );
        this.passwordInputTypeToggleListener    = this.passwordInputTypeToggleListener.bind( this );


        this.enterScene();
    }



    private registerEventListeners(): void {
        this.emailInput.addEventListener( "focus", this.emailInputListener );
        this.passwordInput.addEventListener( "focus", this.passwordInputListener );
        this.forgotPassBtn.addEventListener( "click", this.forgotPassBtnListener );
        this.loginBtn.addEventListener( "click", this.loginBtnListener );
        this.passwordInputTypeToggle.addEventListener( "click", this.passwordInputTypeToggleListener );
    }



    private unregisterEventListeners(): void {
        this.emailInput.removeEventListener( "focus", this.emailInputListener );
        this.passwordInput.removeEventListener( "focus", this.passwordInputListener );
        this.forgotPassBtn.removeEventListener( "click", this.forgotPassBtnListener );
        this.loginBtn.removeEventListener( "click", this.loginBtnListener );
        this.passwordInputTypeToggle.removeEventListener( "click", this.passwordInputTypeToggleListener );
    }



    private emailInputListener(e: any) {
        this.emailInputError.style.display = "none";
    }



    private passwordInputListener(e: any) {
        this.passwordInputError.style.display = "none";
    }



    private forgotPassBtnListener(e: any) {
        this.exitScene( ViewExitTypes.SWITCH_COMPONENT, AuthenticationSignals.SWITCH_LOGIN_TO_FORGOT_PASSWORD );
    }



    private loginBtnListener(e: any) {
        if ( ! this.validateInputs() ) return;

        const email     = this.emailInput.value;
        const password  = this.passwordInput.value;
        const remember  = this.rememberMe.checked;

        const loginModel = new LoginModel( email, password, remember );

        this.connection.login(
            loginModel,
            () => this.sendSignal( AuthenticationSignals.LOGIN ),
            (err: string) => console.error( err )
        )

    }



    private passwordInputTypeToggleListener(e: any) {
        this.passwordInput.type === "text" ? this.passwordInput.type = "password" : this.passwordInput.type = "text";
    }



    public enterScene(enterType?: string): void {
        console.info( "Enter being called in authentication login view component" );


        switch ( enterType ) {

            case ViewEnterTypes.SWITCH_COMPONENT :

                this.container.style.display = "block";

                TweenLite.to( this.container, 0.8, { opacity: 1 } );
                TweenLite.to( this.container, 0.5, { paddingTop: 60,  ease: Back.easeOut.config( 0.35 ) } );

                break;


            case ViewEnterTypes.REVEAL_COMPONENT :

                this.container.style.display = "block";

                TweenLite.to( this.container, 0.8, { opacity: 1 } );
                TweenLite.to( this.container, 0.5, { paddingTop: 60,  ease: Back.easeOut.config( 0.35 ) } );

                break;


            default :
                this.registerEventListeners();
                break;
        }
    }



    public exitScene( exitType: string, signal?: string ): void {
        console.info( "Exit being called in authentication login view component" );



        switch ( exitType ) {

            case ViewExitTypes.SWITCH_COMPONENT :

                TweenLite.to( this.container, 0.4, { paddingTop: 130 } );
                TweenLite.to( this.container, 0.4, { opacity: 0, ease: Power1.easeOut, onComplete: () => {
                    this.container.style.display = "none";

                    if ( signal ) this.sendSignal( signal );

                }});

                break;


            case ViewExitTypes.HIDE_COMPONENT :

                TweenLite.to( this.container, 0.4, { paddingTop: 130, delay: 0.3 } );
                TweenLite.to( this.container, 0.4, { opacity: 0, ease: Power1.easeOut, onComplete: () => {
                    this.container.style.display = "none";
                }});

                break;


            default :

                TweenLite.to( this.container, 0.4, { paddingTop: 130 } );
                TweenLite.to( this.container, 0.4, { opacity: 0, ease: Power1.easeOut, onComplete: () => {

                    super.exitScene( exitType );
                    this.unregisterEventListeners();
                    this.view.componentExited( this.name );

                }});

                break;
        }
    }



    private validateInputs(): boolean {
        const email: string             = this.emailInput.value;
        const isEmailValid: boolean     = ValidationHelper.validateEmail( email );
        const password: string          = this.passwordInput.value;

        if ( ! isEmailValid )   this.emailInputError.style.display          = "block";
        if ( ! password )       this.passwordInputError.style.display       = "block";

        return isEmailValid && password !== "";
    }
}
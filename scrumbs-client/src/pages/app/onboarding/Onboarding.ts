

// CSS
import "../../../style/style-sheets/onboarding.scss"

const modalWelcome = require( "../../../templates/onboarding-modal-welcome.html" );
const tipNewMember = require( "../../../templates/onboarding-tip-new-member.html" );
const tipEditMemberName = require( "../../../templates/onboarding-tip-edit-member-name.html" );
const tipMemberOptions = require( "../../../templates/onboarding-tip-member-options.html" );
const tipImpedimentCheckbox = require( "../../../templates/onboarding-tip-impediment-checkbox.html" );
const tipImpedimentShortcut = require( "../../../templates/onboarding-tip-impediment-shortcut.html" );


export class Onboarding {
    private container: HTMLElement;

    private modalWelcome: HTMLElement;
    private tipNewMember: HTMLElement;
    private tipEditMemberName: HTMLElement;
    private tipMemberOptions: HTMLElement;
    private tipImpedimentCheckbox: HTMLElement;
    private tipImpedimentShortcut: HTMLElement;



    constructor() {


        this.modalWelcome           = document.createElement( "div" );
        this.tipNewMember           = document.createElement( "div" );
        this.tipEditMemberName      = document.createElement( "div" );
        this.tipMemberOptions       = document.createElement( "div" );
        this.tipImpedimentCheckbox  = document.createElement( "div" );
        this.tipImpedimentShortcut  = document.createElement( "div" );

        this.modalWelcome.innerHTML                 = modalWelcome;
        this.tipNewMember.innerHTML                 = tipNewMember;
        this.tipEditMemberName.innerHTML            = tipEditMemberName;
        this.tipMemberOptions.innerHTML             = tipMemberOptions;
        this.tipImpedimentCheckbox.innerHTML        = tipImpedimentCheckbox;
        this.tipImpedimentShortcut.innerHTML        = tipImpedimentShortcut;

        this.registerEventListeners();
    }



    private registerEventListeners(): void {

    }



    public initWelcomeFlow(): void {
        document.body.appendChild( this.modalWelcome );
        document.body.appendChild( this.tipNewMember );
    }



    public initMemberFlow(): void {
        document.body.appendChild( this.tipEditMemberName );
        document.body.appendChild( this.tipMemberOptions );
    }



    public initImpedimentFlow(): void {
        document.body.appendChild( this.tipImpedimentCheckbox );
        document.body.appendChild( this.tipImpedimentShortcut );
    }


}
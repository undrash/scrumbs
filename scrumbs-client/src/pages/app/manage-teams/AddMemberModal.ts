import {ManageTeamsView} from "./ManageTeamsView";


const template = require("../../../templates/manage-teams-add-member-modal.html" );

export class AddMemberModal {

    private container: HTMLElement;
    private view: ManageTeamsView;



    constructor(view: ManageTeamsView) {

        this.view = view;

        this.container = document.createElement( "div" );
        this.container.id = "manage-teams-add-member-modal-container";

        this.container.innerHTML = template;

    }



    public enterScene(): void {
        document.body.appendChild( this.container );
    }



    private exitScene(): void {
        this.container.parentNode.removeChild( this.container );
    }



    public sendSignal(name: string, data?: any, sender?: any) {
        this.view.handleSignal( { name, data, sender } );
    }

}
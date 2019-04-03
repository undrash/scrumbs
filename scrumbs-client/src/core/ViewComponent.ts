

import {ConnectionProxy} from "../connection/ConnectionProxy";
import {IViewComponent} from "./IViewComponent";
import {View} from "./View";





export class ViewComponent implements IViewComponent {
    public container: HTMLElement;
    public view: View;
    public name: string;
    protected connection: ConnectionProxy;

    constructor(view: View, container: HTMLElement) {
        this.view = view;
        this.container = container;
        this.name = ( <any>this ).constructor.name;
        this.connection = new ConnectionProxy( this.name + "Proxy" );
        this.view.viewComponentExitCount[ this.name ] = null;
    }


    public sendSignal(name: string, data?: any, sender?: any) {

        this.view.handleSignal( { name, data, sender } );
    }



    public enterScene(enterType?: string): void {

    }



    public exitScene(exitType: string, signal?: string ): void {
        if ( this.connection ) this.connection.unregister();
    }
}
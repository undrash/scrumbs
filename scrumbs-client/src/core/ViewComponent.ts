

import {ConnectionProxy} from "../connection/ConnectionProxy";
import {IViewComponent} from "./IViewComponent";
import {MemoryStore} from "./MemoryStore";
import {View} from "./View";





export class ViewComponent implements IViewComponent {
    public container: HTMLElement;
    public view: View;
    public name: string;
    protected connection: ConnectionProxy;
    protected memory: MemoryStore;





    constructor(view: View, container: HTMLElement, name: string) {
        this.view               = view;
        this.container          = container;
        this.name               = name;
        this.memory             = MemoryStore._instance;
        this.connection         = new ConnectionProxy( this.name + "Proxy" );

        this.view.viewComponentExitCount[ this.name ] = null;
    }



    public getMemory(): any {
        return this.memory.get( this.name );
    }



    protected saveToMemory(data: any): void {
        this.memory.save( this.name, data );
    }



    protected updateMemory(data: any): void {
        this.memory.update( this.name, data );
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
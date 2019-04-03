

import {CoreEntity} from "./CoreEntity";
import {ISignal} from "./ISignal";
import {IView} from "./IView";





export class View extends CoreEntity implements IView{
    public NAME: string;
    public container: HTMLElement;
    public viewComponentExitCount: any;
    protected exitCallback: Function;

    constructor(viewName: string) {
        super( viewName );
        this.NAME = viewName;
        this.viewComponentExitCount = {};
    }



    public handleSignal(signal: ISignal): void {

    }



    public enterScene(callback?: Function): void {

    }



    public exitScene(exitType: string, callback?: Function): void {

    }



    public componentExited(componentName: string): void {

        this.viewComponentExitCount[ componentName ] = true;

        for ( let key in this.viewComponentExitCount ) {

            if ( this.viewComponentExitCount.hasOwnProperty( key ) ) {

                if ( ! this.viewComponentExitCount[ key ] ) {
                    console.warn( "Not all view components finished exiting, aborting." );
                    return;
                }
            }
        }

        if ( this.exitCallback ) {

            this.container.parentNode.removeChild( this.container );
            this.unregister();

            this.exitCallback();

        } else {

            this.container.parentNode.removeChild( this.container );
            console.warn( "No exit callback available on view!" );

        }
    }

}


import {INotification} from "./INotification";
import {EventManager} from "./EventManager";
import {ICoreEntity} from "./ICoreEntity";





export class CoreEntity implements ICoreEntity {
    public NAME: string;
    public eventManager: EventManager;

    constructor(entityName: string) {
        this.NAME = entityName;
        this.eventManager = EventManager._instance;
        this.register();
    }



    public register(): void {
        this.eventManager.registerEntity( this.NAME, this );
    }



    public onRegister(): void {

    }



    public unregister(): void {
        this.eventManager.unregirsterEntity( this.NAME );
    }



    public onUnregister(): void{

    }



    public sendNotification(notificationName: string, body?: any): void {
        this.eventManager.sendNotification( notificationName, body );
    }



    public listNotificationInterests(): any[] {
        return [];
    }



    public handleNotification(notification: INotification) {

    }

}
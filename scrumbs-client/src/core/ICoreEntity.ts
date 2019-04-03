

import {INotification} from "./INotification";
import {EventManager} from "./EventManager";





export interface ICoreEntity {
    NAME: string;
    eventManager: EventManager;

    onRegister(): void;
    onUnregister(): void;
    listNotificationInterests(): string[];
    handleNotification( notification: INotification ): void;
    sendNotification( notificationName: string, body?: any ): void;
}
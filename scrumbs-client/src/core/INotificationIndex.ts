

import {ICoreEntity} from "./ICoreEntity";

export interface INotificationIndex {
    [notificationName: string]: Array<ICoreEntity>;
}
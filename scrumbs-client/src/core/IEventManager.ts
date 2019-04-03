

export interface IEventManager {
    registerNotification(notificationName: string): void;
    unregisterNotification(notificationName: string): void;
    sendNotification(notificatioName: string): void;
}
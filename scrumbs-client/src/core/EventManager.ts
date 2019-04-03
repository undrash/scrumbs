

import {INotificationIndex} from "./INotificationIndex";
import {IEventManager} from "./IEventManager";
import {IEntityIndex} from "./IEntityIndex";
import {ICoreEntity} from "./ICoreEntity";





export class EventManager implements IEventManager {

    static _instance: EventManager = new EventManager();
    private notifications: INotificationIndex = {};
    private entities: IEntityIndex = {};



    constructor() {
        if ( EventManager._instance ) {
            throw new Error( "Error: Instantiation failed! Use EventManager.getInstance() instead of new." );
        }
        EventManager._instance = this;
    }



    public getInstance(): EventManager {
        return EventManager._instance;
    }



    public registerNotification(notificationName: string): void {
        if ( ! this.notifications[ notificationName ] ) this.notifications[ notificationName ] = new Array<ICoreEntity>();
    }



    public unregisterNotification(notificationName: string): void {
        delete this.notifications[ notificationName ];
    }



    public registerEntity(entityName: string, entity: ICoreEntity): void {

        if ( ! this.entities[ entityName ] ) {

            this.entities[ entityName ] = entity;

            entity.onRegister();

            let notificationInterests = entity.listNotificationInterests();

            for ( let i = 0; i < notificationInterests.length; i++ ) {

                this.registerNotification(notificationInterests[i]);
                this.notifications[ notificationInterests[ i ] ].push( entity );

            }
        }
    }



    public unregirsterEntity(entityName: string): void {

        let targetEntity = this.entities[ entityName ];

        let notificationInterests = targetEntity.listNotificationInterests();

        for ( let i = 0; i < notificationInterests.length; i++ ) {

            let listeningEntities = this.notifications[ notificationInterests[ i ] ];

            for ( let j = 0; j < listeningEntities.length; j++ ) {

                if ( listeningEntities[j] === targetEntity ) {
                    listeningEntities.splice( j, 1 );
                }

            }

        }

        targetEntity.onUnregister();

        delete this.entities[ entityName ];
    }



    public sendNotification(notificationName: string, data?: any): void {
        if ( this.notifications[ notificationName ] ) {

            let entities = this.notifications[ notificationName ];

            for ( let i = 0; i < entities.length; i++ ) {
                entities[i].handleNotification( { name: notificationName,  data: data } );
            }

        }
    }


}
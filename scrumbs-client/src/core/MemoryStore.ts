


import {IComponentData} from "./IComponentData";
import {IMemoryStore} from "./IMemoryStore";





export class MemoryStore implements IMemoryStore {

    static _instance: MemoryStore = new MemoryStore();
    private data: IComponentData = {};



    constructor() {
        if ( MemoryStore._instance ) {
            throw new Error( "Error: Instantiation failed! Use MemoryStore.getInstance() instead of new." );
        }

        MemoryStore._instance = this;
    }



    public getInstance(): MemoryStore {
        return MemoryStore._instance;
    }



    public save(componentName: string, data: any): void {
        this.data[ componentName ] = data;
    }



    public update(componentName: string, data: any): void {

        if ( this.data[ componentName ] ) {
            this.data[ componentName ] = { ...this.data[ componentName ], ...data };
        } else {
            this.data[ componentName ] = data;
        }

    }



    public del(componentName: string): void {
        delete this.data[ componentName ];
    }



    public get(componentName: string): any {
        return this.data[ componentName ] || {};
    }

}
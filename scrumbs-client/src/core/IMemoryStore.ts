


export interface IMemoryStore {
    save(componentName: string, data: any): void;
    get(componentName: string): any;
    update(componentName: string, data: any): void;
    del(componentName: string): void;
}
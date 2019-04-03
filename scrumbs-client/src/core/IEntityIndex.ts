

import {ICoreEntity} from "./ICoreEntity";





export interface IEntityIndex {
    [entityName: string] : ICoreEntity;
}
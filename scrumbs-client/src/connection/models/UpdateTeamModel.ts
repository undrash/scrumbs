

import {IUpdateTeamModel} from "./interfaces/IUpdateTeamModel";





export class UpdateTeamModel implements IUpdateTeamModel {
    public id: string;
    public name: string;
    public members: string[];

    constructor(id: string, name: string, members: string[]) {
        this.id         = id;
        this.name       = name;
        this.members    = members;
    }
}
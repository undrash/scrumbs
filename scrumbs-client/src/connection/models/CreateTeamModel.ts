

import {ICreateTeamModel} from "./interfaces/ICreateTeamModel";





export class CreateTeamModel implements ICreateTeamModel {
    public name: string;
    public members: string[];

    constructor(name: string, members: string[]) {
        this.name       = name;
        this.members    = members;
    }

}
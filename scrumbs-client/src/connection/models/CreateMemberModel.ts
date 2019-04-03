

import {ICreateMemberModel} from "./interfaces/ICreateMemberModel";





export class CreateMemberModel implements ICreateMemberModel {
    public name: string;
    public team: string;

    constructor(name: string, team: string) {
        this.name = name;
        this.team = team;
    }
}
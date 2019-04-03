

import {IAddRemoveMemberModel} from "./interfaces/IAddRemoveMemberModel";





export class AddRemoveMemberModel implements IAddRemoveMemberModel {
    public member: string;
    public team: string;

    constructor(member: string, team: string) {
        this.member     = member;
        this.team       = team;
    }
}
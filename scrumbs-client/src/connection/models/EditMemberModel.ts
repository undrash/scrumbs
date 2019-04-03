

import {IEditMemberModel} from "./interfaces/IEditMemberModel";





export class EditMemberModel implements IEditMemberModel {
    public member: string;
    public name: string;

    constructor(member: string, name: string) {
        this.member     = member;
        this.name       = name;
    }
}
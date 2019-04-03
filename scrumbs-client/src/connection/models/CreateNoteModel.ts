

import {ICreateNoteModel} from "./interfaces/ICreateNoteModel";





export class CreateNoteModel implements ICreateNoteModel {
    public member: string;
    public team: string;
    public content: string;
    public isImpediment: boolean;

    constructor(member: string, team: string, content: string, isImpediment: boolean = false) {
        this.member         = member;
        this.team           = team;
        this.content        = content;
        this.isImpediment   = isImpediment;
    }

}
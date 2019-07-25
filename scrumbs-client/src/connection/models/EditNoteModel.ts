
import {IEditNoteModel} from "./interfaces/IEditNoteModel";



export class EditNoteModel implements IEditNoteModel { constructor(
    public id: string,
    public content: string,
    public isImpediment: boolean
){}}
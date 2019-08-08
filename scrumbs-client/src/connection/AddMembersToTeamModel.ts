
import {IAddMembersToTeamModel} from "./models/interfaces/IAddMembersToTeamModel";





export class AddMembersToTeamModel implements IAddMembersToTeamModel { constructor(
    public id: string,
    public members: string[]
){}}
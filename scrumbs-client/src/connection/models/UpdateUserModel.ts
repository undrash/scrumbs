
import {IUpdateUserModel} from "./interfaces/IUpdateUserModel";



export class UpdateUserModel implements IUpdateUserModel { constructor(
    public name: string,
    public email: string,
    public password: string,
    public oldPassword: string
) {}}
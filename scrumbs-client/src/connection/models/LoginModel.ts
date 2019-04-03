

import {ILoginModel} from "./interfaces/ILoginModel";





export class LoginModel implements ILoginModel {
    public email: string;
    public password: string;

    constructor(email: string, password: string) {
        this.email      = email;
        this.password   = password;
    }
}
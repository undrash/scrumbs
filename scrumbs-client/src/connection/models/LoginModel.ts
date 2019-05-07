

import {ILoginModel} from "./interfaces/ILoginModel";





export class LoginModel implements ILoginModel {
    public email: string;
    public password: string;
    public remember: boolean;

    constructor(email: string, password: string, remember: boolean) {
        this.email      = email;
        this.password   = password;
        this.remember   = remember;
    }
}
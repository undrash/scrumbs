


import {IProxyVO} from "../core/IProxyVO";

export class UserVO implements IProxyVO {
    public name: string;
    public email: string;

    constructor(name: string, email: string) {
        this.name   = name;
        this.email  = email;
    }

}
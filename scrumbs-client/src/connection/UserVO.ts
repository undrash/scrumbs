
import {IProxyVO} from "../core/IProxyVO";



export class UserVO implements IProxyVO {
    public id: string;
    public name: string;
    public email: string;
    public onboardingGuidesDisplayed: number[];

    constructor(id: string, name: string, email: string, onboardingGuidesDisplayed: number[]) {
        this.id                         = id;
        this.name                       = name;
        this.email                      = email;
        this.onboardingGuidesDisplayed  = onboardingGuidesDisplayed;
    }

}

import {IProxyVO} from "../core/IProxyVO";



export class UserVO implements IProxyVO {
    public name: string;
    public email: string;
    public onboardingGuidesDisplayed: number[];

    constructor(name: string, email: string, onboardingGuidesDisplayed: number[]) {
        this.name                       = name;
        this.email                      = email;
        this.onboardingGuidesDisplayed  = onboardingGuidesDisplayed;
    }

}
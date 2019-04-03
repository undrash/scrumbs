

import {ISignal} from "./ISignal";





export interface IView {
    NAME: string;
    handleSignal( signal: ISignal ): void;
    enterScene( callback?: Function ): void;
    exitScene( exitType: string, callback?: Function ): void;
}
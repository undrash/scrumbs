
import {SnackBarType} from "./SnackBarType";



export interface ISnackBar {
    show(type: SnackBarType, message: string): void,
    clear(): void
}
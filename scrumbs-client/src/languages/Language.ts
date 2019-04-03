

import {Hungarian} from "./translations/Hungarian";
import {English} from "./translations/English";
import {Languages} from "./Languages";





export class Language {

    private static currentLanguage: number = Languages.ENGLISH;
    private static languages: any = Language.getLanguagesObject();




    static getTranslation(stringPointer: string): string {

        if ( ! Language.languages || Language.currentLanguage == null ) {
            console.warn( "Language component has not yet been initated!" );
            return;
        }


        if ( ! Language.languages[ Language.currentLanguage ] ) {
            console.warn( "Language is missing!" );
            return;
        }


        if ( ! Language.languages[ Language.currentLanguage ][ stringPointer ] ) {
            console.warn( "The current language does not contain the specified pointer!" );
            return;
        }

        return Language.languages[ Language.currentLanguage ][ stringPointer ];
    }



    private static getLanguagesObject(): object {
        let languages: any = {};

        languages[ Languages.ENGLISH ]      = English;
        languages[ Languages.HUNGARIAN ]    = Hungarian;

        return languages;
    }

}
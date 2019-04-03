


export class OperationsHelper {


    /**
     * Validates the email address provided
     * @param {string} email address
     * @return {boolean} - is valid?
     */
    public static validateEmail(email: string): boolean {

        let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return regex.test( String(email).toLocaleLowerCase() );

    }



    /**
     * Sleep/Pause the process on a specific line for a period of time
     *
     * Usage (within async function):
     * example: await OperationsHelper.sleep( 1000 );
     *
     * @param {number} ms - milliseconds
     * @return {any}
     */
    public static sleep(ms: number): any {
        return new Promise( resolve => { setTimeout( resolve, ms ) } );
    }

}
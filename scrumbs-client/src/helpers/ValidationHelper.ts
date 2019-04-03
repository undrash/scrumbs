



export class ValidationHelper {


    /**
     * Validates the email address provided
     * @param {string} email address
     * @return {boolean} - is valid?
     */
    public static validateEmail(email: string): boolean {

        let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return regex.test( String(email).toLocaleLowerCase() );

    }

}
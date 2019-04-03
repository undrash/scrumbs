"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationHelper {
    /**
     * Validates the email address provided
     * @param {string} email address
     * @return {boolean} - is valid?
     */
    static validateEmail(email) {
        let regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return regex.test(String(email).toLocaleLowerCase());
    }
}
exports.ValidationHelper = ValidationHelper;
//# sourceMappingURL=ValidationHelper.js.map
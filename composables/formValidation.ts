import moment from "moment";

/**
 * Provides common validation rules for form fields.
 */
export function useValidation() {

    /**
     * Validates that the field is required.
     * @param value - The value to validate.
     * @returns {boolean|string} - True if valid, otherwise an error message.
     */
    const required = (value: any) => {
        if (Array.isArray(value) && value.length === 0) {
            return 'Required field';
        }

        return !!value || 'Required field';
    }


    const url = (value: string) => {
        if (!value) return true;
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
            '(([\\da-z.-]+)\\.([a-z.]{2,6})|' +
            '(([0-9]{1,3}\\.){3}[0-9]{1,3}))' +
            '(\\:[0-9]{1,5})?' +
            '(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$',
            'i'
        );
        return pattern.test(value) || 'Invalid URL';
    };


    /**
     * Validates that the field contains a valid email address.
     * @param value - The value to validate.
     * @returns {boolean|string} - True if valid, otherwise an error message.
     */
    const email = (value: string) => {
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return pattern.test(value) || 'Invalid email address';
    };

    /**
     * Validates that the field contains a password with a minimum length.
     * @param value - The value to validate.
     * @returns {boolean|string} - True if valid, otherwise an error message.
     */
    const password = (value: string) => {
        const minLength = 8;
        return value.length >= minLength || `Password must be at least ${minLength} characters`;
    };

    /**
     * Validates that the field contains a string with a minimum length.
     * @param min - The minimum length.
     * @returns {Function} - A validation function.
     */
    const minLength = (min: number) => (value: string) => {
        return value.length >= min || `Must be at least ${min} characters`;
    };

    /**
     * Validates that the field contains a string with a maximum length.
     * @param max - The maximum length.
     * @returns {Function} - A validation function.
     */
    const maxLength = (max: number) => (value: string) => {
        return value.length <= max || `Must be no more than ${max} characters`;
    };

    /**
     * Validates that the field contains a number with a minimum value.
     * @param min         - The minimum value.
     * @param customError - (Optional) Custom error message to return if validation fails.
     * @returns {Function} - A validation function that returns `true` or a string error.
     */
    const minNumber = (min: number, customError?: string) => (value: number) => {
        return value >= min || customError || `Must be at least ${min}`;
    };
    /**
     * Validates that the field contains a number with a maximum value.
     * @param max - The maximum value.
     * @returns {Function} - A validation function.
     */
    const maxNumber = (max: number) => (value: number) => {
        return value <= max || `Must be no more than ${max}`;
    };

    /**
     * Validates that the field contains a string with a custom length.
     * @param min - The minimum length.
     * @param max - The maximum length.
     * @returns {Function} - A validation function.
     */
    const customLength = (min: number, max: number) => (value: string) => {
        return (value.length >= min && value.length <= max) || `Must be between ${min} and ${max} characters`;
    };

    /**
    * Validates that the field contains a string with a specified length.
    * @param fixed - The specified fixed length.
    * @returns {Function} - A validation function.
    */
    const fixedStringLength = (fixed: number) => (value: string) => {
        return value.length == fixed || `Must be ${fixed} characters long`;
    };
    /**
    * Validates that the field contains a string with a specified length.
    * @param fixed - The specified fixed length.
    * @returns {Function} - A validation function.
    */
    const isNumber = (value: number) => {
        return !isNaN(value) || 'Only numbers are allowed'
    };

    /**
     * Validates that the field contains a number within a custom range.
     * @param min - The minimum value.
     * @param max - The maximum value.
     * @returns {Function} - A validation function.
     */
    const customNumberRange = (min: number, max: number) => (value: number) => {
        return (value >= min && value <= max) || `Must be between ${min} and ${max}`;
    };
    const validateClockIn = (correctedTime: string, clockOutTime: string) => {
        const date1 = moment(correctedTime, "MM/DD/YYYY, hh:mm:ss A");
        const date2 = moment(clockOutTime, "MM/DD/YYYY, hh:mm:ss A");
        return date1.isBefore(date2) || "Clock In time must be Less than ClockOutTime";
    }
    const validateClockOut = (correctedTime: string, clockInTime: string) => {
        const date1 = moment(correctedTime, "MM/DD/YYYY, hh:mm:ss A");
        const date2 = moment(clockInTime, "MM/DD/YYYY, hh:mm:ss A");
        return date1.isAfter(date2) || "Clock Out time must be  Greater than ClockIntime";
    }

    return {
        required,
        email,
        password,
        minLength,
        maxLength,
        minNumber,
        maxNumber,
        customLength,
        fixedStringLength,
        customNumberRange,
        validateClockIn,
        validateClockOut,
        isNumber,
        url
    };
}

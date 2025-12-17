export const isEmail = (value: string) => {
    if (!value) return false;
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(value);
};

export const isDniValid = (value: string) => {
    if (!value) return false;
    const digits = value.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 10;
};

export const minLength = (value: string, len = 3) => {
    if (!value) return false;
    return value.trim().length >= len;
};

export const isNotEmpty = (value: string) => {
    return !!value && value.trim().length > 0;
};

export const isAlpha = (value: string) => {
    if (!value) return false;
    // allow letters (including accents) and spaces, no digits or punctuation
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value.trim());
};

export const isNumeric = (value: string) => {
    if (!value) return false;
    return /^\d+$/.test(value.trim());
};

export default { isEmail, isDniValid, minLength, isNotEmpty };

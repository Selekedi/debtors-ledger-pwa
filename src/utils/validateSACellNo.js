export default function isValidSACellNumber(number) {
    // Allow optional +27 country code and convert it to 0
    const normalizedNumber = number.replace(/^(\+27)/, "0");

    // Check if it follows the SA mobile number pattern
    const regex = /^(06|07|08|09)\d{8}$/;
    
    if (regex.test(normalizedNumber)) {
        return { valid: true, reason: "Valid South African cell number." };
    } else {
        return { valid: false, reason: "Invalid SA cell number format." };
    }
}
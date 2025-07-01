export default function isValidSAID(idNumber) {
    // Check if it's exactly 13 digits and contains only numbers
    if (!/^\d{13}$/.test(idNumber)) {
        return { valid: false, reason: "Invalid format: Must be 13 digits." };
    }

    // Extract parts
    const dob = idNumber.substring(0, 6);
    const citizenship = idNumber.charAt(10);
    const checksumDigit = parseInt(idNumber.charAt(12), 10);

    // Validate date (YYMMDD)
    if (!isValidDate(dob)) {
        return { valid: false, reason: "Invalid date of birth." };
    }

    // Citizenship check (0 = citizen, 1 = permanent resident)
    if (citizenship !== "0" && citizenship !== "1") {
        return { valid: false, reason: "Invalid citizenship digit." };
    }

    // Validate checksum using the Luhn Algorithm
    if (!luhnCheck(idNumber)) {
        return { valid: false, reason: "Failed checksum validation." };
    }

    return { valid: true, reason: "Valid South African ID number." };
}

// Function to validate YYMMDD as a real date
function isValidDate(yyMMdd) {
    const year = parseInt(yyMMdd.substring(0, 2), 10);
    const month = parseInt(yyMMdd.substring(2, 4), 10);
    const day = parseInt(yyMMdd.substring(4, 6), 10);

    const fullYear = year >= 0 && year <= 99 ? (year >= 50 ? 1900 + year : 2000 + year) : null;
    if (!fullYear) return false;

    const date = new Date(fullYear, month - 1, day);
    return date.getFullYear() === fullYear && date.getMonth() === month - 1 && date.getDate() === day;
}

// Luhn Algorithm for checksum validation
function luhnCheck(idNumber) {
    let sum = 0;
    let alternate = false;

    for (let i = idNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(idNumber[i], 10);

        if (alternate) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        alternate = !alternate;
    }

    return sum % 10 === 0;
}

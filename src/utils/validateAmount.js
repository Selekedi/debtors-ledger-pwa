export default function validateAmount(amount) {
    const parsed = parseFloat(amount);

    if (isNaN(parsed)) {
        return { valid: false, reason: "Amount is not a number" };
    }

    if (parsed <= 0) {
        return { valid: false, reason: "Amount is zero or less than zero" };
    }

    const value = Math.round(parsed * 100) / 100;

    return { valid: true, value };
}

const amount = validateAmount(100.5555)
console.log(amount)

module.exports = {
    validate: (submission) => {
        if (!submission || typeof submission !== 'string') {
            return { success: false, message: "Invalid payload type." };
        }

        // Exact coordinate key expected from binary matrix decoding
        const normalized = submission.trim().toUpperCase();
        if (normalized === "LAB03_SHELF2") {
            return { success: true };
        }

        return { success: false, message: "Incorrect layout coordinates. Parity bit mismatch." };
    }
};
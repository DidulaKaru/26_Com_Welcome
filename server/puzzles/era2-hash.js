module.exports = {
    validate: (submission) => {
        if (!submission || typeof submission !== 'string') {
            return { success: false, message: "Invalid payload type." };
        }

        // Trim whitespace and convert to uppercase to match the expected constant safely
        const normalized = submission.trim().toUpperCase();

        // The expected hash
        const EXPECTED_HASH = "53473546F42BA506";

        if (normalized === EXPECTED_HASH) {
            return { success: true };
        }

        return { success: false, message: "Hash verification failed. Incorrect key or iteration count." };
    }
};
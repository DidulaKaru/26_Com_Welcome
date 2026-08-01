module.exports = {
    validate: (submission) => {
        if (!submission || typeof submission !== 'string') {
            return { success: false, message: "Invalid payload type." };
        }

        const normalized = submission.trim().toUpperCase();
        if (normalized === "NCC") {
            return { success: true };
        }

        return { success: false, message: "Invalid destination building code." };
    }
};
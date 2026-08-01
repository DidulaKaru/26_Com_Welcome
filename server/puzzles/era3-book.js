module.exports = {
    validate: (submission) => {
        if (!submission || typeof submission !== 'string') {
            return { success: false, message: "Invalid payload type." };
        }

        const normalized = submission.trim();
        if (normalized === "10.50.80.5") {
            return { success: true };
        }

        return { success: false, message: "Incorrect IPv4 address sequence." };
    }
};
module.exports = {
    validate: (submission) => {
        if (!submission || typeof submission !== 'string') {
            return { success: false, message: "Invalid payload type." };
        }

        // Key hidden inside the frequency-domain spectrogram plot
        const normalized = submission.trim().toLowerCase();
        if (normalized === "harmonics_440hz") {
            return { success: true };
        }

        return { success: false, message: "Signal decode failed. Phase shift detected." };
    }
};
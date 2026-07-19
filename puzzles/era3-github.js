module.exports = {
    validate: (submission) => {
        // Now expects 200 instead of 5000
        if (submission && submission.attackModeEnabled === true && submission.maxRateLimit >= 200) {
            return { success: true };
        }

        return {
            success: false,
            message: "Pull Request rejected: core system still bound by rate-limiting middleware maximum = 1."
        };
    }
};
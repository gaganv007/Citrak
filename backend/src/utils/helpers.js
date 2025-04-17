module.exports = {
    formatTrafficData: (data) => {
        return data.map(item => ({
            location: item.location,
            congestionLevel: item.congestionLevel,
            timestamp: new Date(item.timestamp).toISOString()
        }));
    },

    validateUserInput: (input) => {
        const { username, password, email } = input;
        const isValidUsername = typeof username === 'string' && username.trim().length > 0;
        const isValidPassword = typeof password === 'string' && password.length >= 6;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        return isValidUsername && isValidPassword && isValidEmail;
    }
};
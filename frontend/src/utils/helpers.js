export const formatTrafficData = (data) => {
    return data.map(item => ({
        location: item.location,
        congestionLevel: item.congestionLevel,
        timestamp: new Date(item.timestamp).toLocaleString()
    }));
};

export const validateUserInput = (input) => {
    const { username, password, email } = input;
    const isValidUsername = username && username.length >= 3;
    const isValidPassword = password && password.length >= 6;
    const isValidEmail = email && /\S+@\S+\.\S+/.test(email);
    return isValidUsername && isValidPassword && isValidEmail;
};

export const calculateAverageCongestion = (trafficData) => {
    const totalCongestion = trafficData.reduce((acc, item) => acc + item.congestionLevel, 0);
    return totalCongestion / trafficData.length;
};
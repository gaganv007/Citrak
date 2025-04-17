import React, { useState } from 'react';

const Settings = () => {
    const [preferences, setPreferences] = useState({
        notifications: true,
        theme: 'light',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPreferences({
            ...preferences,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save preferences logic here
        console.log('Preferences saved:', preferences);
    };

    return (
        <div className="settings-page">
            <h1>User Settings</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="notifications"
                            checked={preferences.notifications}
                            onChange={handleChange}
                        />
                        Enable Notifications
                    </label>
                </div>
                <div>
                    <label>
                        Theme:
                        <select
                            name="theme"
                            value={preferences.theme}
                            onChange={handleChange}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </label>
                </div>
                <button type="submit">Save Preferences</button>
            </form>
        </div>
    );
};

export default Settings;
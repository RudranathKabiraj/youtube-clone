import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load from localStorage on first render
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Normalize: always use channelId, never channel
            if (parsed.channel && !parsed.channelId) {
                parsed.channelId = typeof parsed.channel === "object" && parsed.channel?._id
                    ? parsed.channel._id
                    : parsed.channel;
                delete parsed.channel;
            }
            setUser(parsed);
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (user) {
            // Normalize: always use channelId, never channel
            const toStore = { ...user };
            if (toStore.channel) {
                toStore.channelId = typeof toStore.channel === "object" && toStore.channel?._id
                    ? toStore.channel._id
                    : toStore.channel;
                delete toStore.channel;
            }
            localStorage.setItem("user", JSON.stringify(toStore));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
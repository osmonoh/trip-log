import { createContext, useContext } from "react";

const CitiesContext = createContext();

const useCities = () => {
    const context = useContext(CitiesContext);
    if (context === undefined) {
        throw new Error('CitiesContext was used outside the CitiesProvider');
    }
    return context;
};

const AuthContext = createContext();

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('AuthContext was used outside AuthpProvider');
    }
    return context;
};

export {CitiesContext, AuthContext, useCities, useAuth};

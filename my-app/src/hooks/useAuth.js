import React from 'react';


export const AppContext = React.createContext({});

const useAuth = () => {
    const {
        auth: { user, setUser },
    } = React.useContext(AppContext);
    return [user, setUser];
};

export default useAuth;

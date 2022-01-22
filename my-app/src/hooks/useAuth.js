import React from 'react';
import { AppContext } from '../App';

const useAuth = () => {
    const {
        auth: { user, setUser },
    } = React.useContext(AppContext);
    return [user, setUser];
};

export default useAuth;

import React from 'react';
import UserContext from '../contexts/user-context';

const useAuth = () => {
    const { user, setUser } = React.useContext(UserContext);
    return [user, setUser];
};

export default useAuth;

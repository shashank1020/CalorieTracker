import { notification } from 'antd';

export const openNotification = ({ type = 'info', message = '', description = '' }) => {
    notification.open({
        type: type,
        message: message,
        description: description,
    });
};

export const getToken = () => {
    //get token from local storage or something..
    // currently the token is userId
    return '1';
};

export const getUserHeaders = () => {
    const token = getToken();
    return {
        headers: {
            jwt: token,
        },
    };
};

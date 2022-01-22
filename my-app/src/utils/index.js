import { notification } from 'antd';

export const openNotification = ({ type = 'info', message = '', description = '' }) => {
    notification.open({
        type: type,
        message: message,
        description: description,
    });
};

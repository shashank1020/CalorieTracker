import React from 'react';
import { AppContext } from '../App';

const useActiveModal = () => {
    const {
        modal: { activeModalId, setActiveModalId },
    } = React.useContext(AppContext);
    return [activeModalId, setActiveModalId];
};

export default useActiveModal;

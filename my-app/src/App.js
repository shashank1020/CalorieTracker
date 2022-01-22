import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import ListEntries from './page/listFoodEntries/list-food';
import SideNavigationComp from './components/molecules/sideNavigation/side-navigation';
import Reports from './page/listFoodEntries/Reports';
import NotFound from './page/NotFound';
export const AppContext = React.createContext({});

function App() {
    const [user, setUser] = useState({ user: 'user', isAdmin: true });
    const [isOpen, setIsOpen] = useState(false);
    const [activeModalId, setActiveModalId] = useState('');

    return (
        <div className="App">
            <AppContext.Provider value={{ auth: { user, setUser }, modal: { activeModalId, setActiveModalId } }}>
                <BrowserRouter>
                    <SideNavigationComp />
                    <Routes>
                        <Route path={'/'} element={<ListEntries />} />
                        {user.isAdmin && <Route path={'/reports'} element={<Reports />} />}
                        <Route path="/*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        </div>
    );
}

export default App;

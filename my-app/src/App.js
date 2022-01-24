import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import ListEntries from './page/listFoodEntries/list-food';
import SideNavigationComp from './components/molecules/sideNavigation/side-navigation';
import Reports from './page/Reports';
import NotFound from './page/NotFound';
import UserService from './services/user-service';
export const AppContext = React.createContext({});

function App() {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeModalId, setActiveModalId] = useState('');
    React.useEffect(() => {
        (async function () {
            let authUser = await UserService.getUserDetail();
            if (authUser) {
                setUser({ ...authUser });
                setIsLoading(false);
            }
        })();
    }, []);
    return (
        <div className="App">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
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
            )}
        </div>
    );
}

export default App;

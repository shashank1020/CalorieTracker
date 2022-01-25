import './App.css';
import 'antd/dist/antd.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import React, {useState} from 'react';
import ListEntries from './page/listFoodEntries/list-food';
import SideNavigationComp from './components/molecules/sideNavigation/side-navigation';
import Reports from './page/Reports';
import NotFound from './page/NotFound';
import UserService from './services/user-service';
import {AppContext} from "./hooks/useAuth";

function App() {
    const [user, setUser] = useState({});
    const [reloadFoods, setReloadFoods] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [activeModalId, setActiveModalId] = useState('');
    React.useEffect(() => {
        (async function () {
            UserService.getUserDetail().then((authUser) => {
                setUser(authUser);
            }).finally(() => {
                setIsLoading(false)
            })
        })();
    }, []);
    return (
        <div className="App">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <AppContext.Provider value={{
                    auth: {user, setUser},
                    modal: {activeModalId, setActiveModalId},
                    reload: {reloadFoods, setReloadFoods}
                }}>
                    <BrowserRouter>
                        <SideNavigationComp/>
                        <Routes>
                            <Route path={'/'} element={<ListEntries/>}/>
                            {user.isAdmin && <Route path={'/reports'} element={<Reports/>}/>}
                            <Route path="/*" element={<NotFound/>}/>
                        </Routes>
                    </BrowserRouter>
                </AppContext.Provider>
            )}
        </div>
    );
}

export default App;

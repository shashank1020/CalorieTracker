import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FoodEntry from './page/foodEntry/food-entry';
import UserContext from './contexts/user-context';
import React, { useState } from 'react';
import ListEntries from './page/listFoodEntries/list-food';

function App() {
    const [user, setUser] = useState({ user: 'user', isAdmin: true });
    return (
        <div className="App">
            <UserContext.Provider value={{ user, setUser }}>
                <BrowserRouter>
                    <Routes>
                        <Route path={'/food/new'} element={<FoodEntry />} />
                        <Route path={'/'} element={<ListEntries />} />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
}

export default App;

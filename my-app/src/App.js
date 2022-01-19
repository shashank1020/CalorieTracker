import './App.css';
import 'antd/dist/antd.css'
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import FoodEntry from "./page/food-entry";
import UserContext from "./contexts/user-context";
import {useState} from "react";

function App() {
    const [user, setUser] = useState({});
    return (
        <div className="App">

            <UserContext.Provider value={{user, setUser}}>
                <BrowserRouter>
                    <Routes>
                        <Route path={"/food/new"} element={<FoodEntry/>}/>
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </div>
    );
}

export default App;

import React, {useEffect} from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Layout from "./components/Layout/Layout";
import AllTasks from "./pages/AllTasks/AllTasks";
import {IMenu, menu} from "./components/Layout/Navigate/Navigate";
import NotFound from "./pages/NotFound/NotFound";


function App() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!menu.find((m:IMenu)=>m.path === pathname) && pathname !== '/'){
            navigate('/404')
        }

    }, []);


    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path='/all_task' element={<AllTasks/>}/>
                <Route path='/important' element={<AllTasks/>}/>
                <Route path='/done' element={<AllTasks/>}/>
                <Route path='/404' element={<NotFound/>}/>
            </Route>
        </Routes>
    );
}

export default App;

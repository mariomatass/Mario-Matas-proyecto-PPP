import React from 'react'
import './App.css';
import Login from './components/Login'
import Home from './components/Home'
import Registro from './components/Registro'
import Getuser from './components/getuser'
import OpenLibraryPage from './components/OpenLibraryPage'
import FavoritesPage from './components/FavoritesPage'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                index: true,
                element: <Login/>
            },
            {
                path: 'home',
                element: <Home/>
            },
            {
                path: 'registro',
                element: <Registro/>
            },
            {
                path: 'getuser',
                element: <Getuser/>
            },
            {
                path: 'OpenLibraryPage',
                element: <OpenLibraryPage/>
            },
            {
                path: 'FavoritesPage',
                element: <FavoritesPage/>
            },
            {
                path: 'Login',
                element: <Login/>
            }
            
        ]
    }
])
function App() {
    return (
        <RouterProvider router={router} />
    );
}
export default App;

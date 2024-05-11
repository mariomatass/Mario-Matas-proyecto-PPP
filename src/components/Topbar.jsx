import { Button, Typography } from "@mui/material";
import React from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginActions } from '../store/storelogin';
import { Tooltip } from "@mui/material";

function Topbar() {
    const userData = useSelector(state => state.login);
    const dispatch = useDispatch();
    const handleOnClick = (e) => {
        dispatch(loginActions.logout());
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', top: 0, width: '100%', backgroundColor: '#f58d42', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', padding: '10px 0', height: '75px' }}>
            <Typography>{userData.userName}</Typography>
            <Link to='/home' style={{ textDecoration: 'underline', color: 'black' }}>Inicio</Link>
            {userData.userRol === 'admin' && <Link to='/getuser' style={{ textDecoration: 'underline', color: 'black' }}>Gestión Profesorado</Link>}
            <Link to='/OpenLibraryPage' style={{ textDecoration: 'underline', color: 'black' }}>Información sobre libros</Link>
            <Link to='/FavoritesPage' style={{ textDecoration: 'underline', color: 'black' }}>Libros favoritos</Link>
            <Tooltip title="Volver al login" arrow>
                <Link to='/login' style={{ textDecoration: 'none' }}>
                    <Button variant="contained" onClick={handleOnClick} style={{ backgroundColor: '#8932a8', color: 'white' }}>
                        Salir
                    </Button>
                </Link>
            </Tooltip>
        </div>
    );
}
export default Topbar;

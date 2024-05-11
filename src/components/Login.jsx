import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Typography, Box, TextField, Paper, Grid, Avatar, Tooltip } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginActions } from '../store/storelogin';
import { db } from "../Firebaseconfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const spacingStyles = {
    margin: '8px',
    width: '95%'
};

const spacingAvatar = {
    margin: '8px',
};

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({ user: '', pwd: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const q = query(collection(db, "Usuarios"), where("login", "==", data.user));
            const querySnapshot = await getDocs(q);
            const docs = []
            querySnapshot.forEach(doc => docs.push(doc)) 
            if(docs.length === 0){
                return;
            } 
            const user = docs[0].data()
            console.log(docs)
            if(user.login !== data.user && user.password !==data.pwd){
                return;
            } 

            console.log(user)
            if (user) {
                dispatch(loginActions.login({
                    name: user.nombre,
                    rol: user.rol,
                    id: docs[0].id
                }));
                navigate('/home');
            } else {
                console.log('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error durante la consulta a Firestore:', error);
        }
    };

    return (
        <Grid
            container
            component="main"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Grid
                item
                component={Paper}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                xs={10}
                sm={8}
                md={6}
            >
                <Avatar variant="solid" style={spacingAvatar}></Avatar>
                <Typography align="center">Inicio de sesión</Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    style={spacingStyles}
                    width="100%"
                >
                    <TextField
                        id="usuario"
                        label="Usuario"
                        variant="outlined"
                        style={spacingStyles}
                        value={data.user}
                        onChange={(event) => setData({ ...data, user: event.target.value })}
                    />
                    <TextField
                        id="password"
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        style={spacingStyles}
                        value={data.pwd}
                        onChange={(event) => setData({ ...data, pwd: event.target.value })}
                    />
                    <Tooltip title="Acceder" arrow>
                        <div>
                            <Button type="submit" variant="contained" style={spacingStyles}>Entrar</Button>
                            <Button component={Link} to="/registro" variant="contained" style={spacingStyles}>Registrarse</Button>
                        </div>
                    </Tooltip>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Login;

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Typography, Box, TextField, Paper, Grid, Avatar, Tooltip, Select, MenuItem, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from "../Firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const spacingStyles = {
    margin: '8px',
    width: '95%'
};

const spacingAvatar = {
    margin: '8px',
};

function Registro() {
    const navigate = useNavigate();

    const [data, setData] = useState({ login: '', password: '', nombre: '', rol: 'alumno' });
    const [showAdminOption, setShowAdminOption] = useState(false);
    const [showProfesorOption, setShowProfesorOption] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'Usuarios'), data);
            console.log("Documento registrado con ID: ", docRef.id);

            navigate('/');
        } catch (error) {
            console.error("Error al registrar usuario: ", error);
        }
    };

    const handleVolver = () => {
        navigate('/');
    };

    const handleLoginChange = (event) => {
        setData({ ...data, login: event.target.value });
        setShowAdminOption(event.target.value === 'administrador@outlook.es');
        setShowProfesorOption((event.target.value === 'Profesores@outlook.es'))
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
                <Typography align="center">Registro</Typography>
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
                        id="login"
                        label="Login"
                        variant="outlined"
                        style={spacingStyles}
                        value={data.login}
                        onChange={handleLoginChange}
                    />
                    <TextField
                        id="password"
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        style={spacingStyles}
                        value={data.password}
                        onChange={(event) => setData({ ...data, password: event.target.value })}
                    />
                    <TextField
                        id="nombre"
                        label="Nombre"
                        variant="outlined"
                        style={spacingStyles}
                        value={data.nombre}
                        onChange={(event) => setData({ ...data, nombre: event.target.value })}                    
                    />
                    <FormControl variant="outlined" style={spacingStyles}>
                        <Select
                            id="rol"
                            value={data.rol}
                            onChange={(event) => setData({ ...data, rol: event.target.value })}
                        >
                            <MenuItem value="alumno">Alumno</MenuItem>
                            {showProfesorOption && <MenuItem value="profesor">Profesor</MenuItem>}
                            {showAdminOption && <MenuItem value="admin">Administrador</MenuItem>}
                        </Select>
                    </FormControl>
                    <Tooltip title="Registrarse" arrow>
                        <Button type="submit" variant="contained" style={spacingStyles}>
                            Registrarse
                        </Button>
                    </Tooltip>
                    <Tooltip title="Volver al inicio de sesión" arrow>
                        <Button onClick={handleVolver} variant="contained" style={spacingStyles}>
                            Volver
                        </Button>
                    </Tooltip>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Registro;

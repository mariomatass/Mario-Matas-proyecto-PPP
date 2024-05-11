import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, MenuItem } from "@mui/material";
import WavingHandIcon from '@mui/icons-material/WavingHand';
import { Tooltip } from "@mui/material";
import Topbar from "./Topbar"
import { db } from "../Firebaseconfig";
import { addDoc, collection, deleteDoc, getDocs, doc } from "firebase/firestore";

function Home() {
    const userData = useSelector(state => state.login);
    const navigate = useNavigate();
    const isLoggedin = userData.isAutenticated;
    const [item, setItem] = useState({
        tipo: '',
        asignatura: '',
        editorial: '',
        curso: '',
        cantidad: 1,
        Autor: '',
        nombre: ''
    });
    const [tableData, setTableData] = useState([]);
    const [Showbutton, setShowButton] = useState(false);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);

    const handleSaveItem = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, 'items'), item);
        handleSelectItem();
        setItem({
            tipo: '',
            asignatura: '',
            editorial: '',
            curso: '',
            cantidad: 1,
            Autor: '',
            nombre: ''
        });
    };

    const handleSelectItem = async () => {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const newTableData = [];
        querySnapshot.forEach((document)=>{
            newTableData.push({id:document.id,...document.data()})
        })
        setTableData(newTableData);
    };

    const handleDeleteItem = async(identifier) => {
        const items = doc(db,"items",identifier)
        await deleteDoc(items) 
        setChangedTable(!ChangedTable)
    }

    const [ChangedTable, setChangedTable] = useState(true);

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/');
        } else {
            handleSelectItem()
        }
    }, [isLoggedin, navigate]);

    return (
        <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        
            <Topbar></Topbar>
                <div style={{width: '100%'}}>
                <Box
                    component="form"
                    autoComplete="off"
                    onSubmit={handleSaveItem}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 2,
                    }}
                >
                    <TextField
                        label="Tipo"
                        select
                        required
                        value={item.tipo}
                        onChange={(event) => {
                            const value = event.target.value;
                            if (!Showbutton) setShowButton(true);
                            setItem({ ...item, tipo: value });
                            if (value === 'Libro de texto' || value === 'Libro de lectura') {
                                setShowAdditionalFields(true);
                            } else {
                                setShowAdditionalFields(false);
                            }
                        }}
                        sx={{ marginBottom: 2, width: 250, background: "white" }}
                    >
                        <MenuItem value="Libro de texto">Libro de texto</MenuItem>
                        <MenuItem value="Libro de lectura">Libro de lectura</MenuItem>
                    </TextField>
                    {showAdditionalFields && item.tipo === 'Libro de texto' && (
                        <>
                            <TextField
                                label="Asignatura"
                                required
                                value={item.asignatura}
                                onChange={(event) => setItem({ ...item, asignatura: event.target.value })}
                                sx={{ marginBottom: 2, background: "white" }}
                            />
                            <TextField
                                label="Editorial"
                                required
                                value={item.editorial}
                                onChange={(event) => setItem({ ...item, editorial: event.target.value })}
                                sx={{ marginBottom: 2 , background: "white"}}
                            />
                            <TextField
                                label="Curso"
                                required
                                value={item.curso}
                                onChange={(event) => setItem({ ...item, curso: event.target.value })}
                                sx={{ marginBottom: 2, background: "white" }}
                            />
                            <TextField
                                label="Cantidad"
                                type="number"
                                value={item.cantidad}
                                onChange={(event) => setItem({ ...item, cantidad: event.target.value })}
                                sx={{ marginBottom: 2, background: "white" }}
                            />
                        </>
                    )}
                    {showAdditionalFields && item.tipo === 'Libro de lectura' && (
                        <>
                            <TextField
                                label="Autor"
                                required
                                value={item.Autor}
                                onChange={(event) => setItem({ ...item, Autor: event.target.value })}
                                sx={{ marginBottom: 2, background: "white" }}
                            />
                            <TextField
                                label="Nombre del libro"
                                required
                                value={item.nombre}
                                onChange={(event) => setItem({ ...item, nombre: event.target.value })}
                                sx={{ marginBottom: 2, background: "white" }}
                            />
                            <TextField
                                label="Cantidad"
                                type="number"
                                value={item.cantidad}
                                onChange={(event) => setItem({ ...item, cantidad: event.target.value })}
                                sx={{ marginBottom: 2, background: "white" }}
                            />
                        </>
                    )}
                    {Showbutton && <Tooltip title="Añadir registro" arrow><Button type="submit" variant="contained">Insertar</Button></Tooltip>}
                </Box>
                </div>
                
                <div style={{width: '100%'}}>
                <TableContainer style={{ maxHeight: '400px', overflow: 'auto', background: "white"}}>
                    <Table aria-label="tabla">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black' }}></TableCell>
                                <TableCell style={{ color: 'black' }}>Tipo</TableCell>
                                <TableCell style={{ color: 'black' }}>Autor / Asignatura</TableCell>
                                <TableCell style={{ color: 'black' }}>Nombre/ Editorial</TableCell>
                                <TableCell style={{ color: 'black' }}>Curso</TableCell>
                                <TableCell style={{ color: 'black' }}>Cantidad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {['admin', 'alumno', 'profesor'].includes(userData.userRol) &&
                                            <Tooltip title="Si le das aqui te llevaras el libro de la biblioteca" arrow>
                                                <Button onClick={() => handleDeleteItem(row.id)}>
                                                    <WavingHandIcon />
                                                </Button>
                                            </Tooltip>}
                                    </TableCell>
                                    <TableCell>{row.tipo}</TableCell>
                                    <TableCell>{row.asignatura || row.Autor}</TableCell>
                                    <TableCell>{row.editorial || row.nombre}</TableCell>
                                    <TableCell>{row.curso}</TableCell>
                                    <TableCell>{row.cantidad}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </div>
        </div>
    );
}

export default Home;



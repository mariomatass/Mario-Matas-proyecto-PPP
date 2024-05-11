import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button, TextField, Box, Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Topbar from "./Topbar";
import WavingHandIcon from '@mui/icons-material/WavingHand';
import { Tooltip } from "@mui/material";
import { addDoc, collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import { db } from "../Firebaseconfig";

function Zonapruebas(){
    const userData = useSelector(state => state.login);
    const navigate = useNavigate();
    const isLoggedin = userData.isAutenticated;
    const [item, setItem] = useState({ nombre: '', login: '', password: '', rol:''})
    const [tableData, setTableData] = useState([])

    const handleSaveItem = async (e) => {
        e.preventDefault();
        const querySnapshot = await addDoc(collection(db, 'Profesores'), item)
        console.log(querySnapshot)

        handleSelectItem();
        setItem({
            nombre: '',
            Asignatura: '',
            Genero: '',
            Numerotlf: ''
        });
    };
    
    const handleSelectItem = async () => {
        const querySnapshot = await getDocs(collection(db, 'Profesores'));
        const newTableData = [];
        querySnapshot.forEach((document)=>{
            newTableData.push({id:document.id,...document.data()})
        })
        setTableData(newTableData);
    };

    const handleDeleteItem = async(identifier) => {
        const items = doc(db,"Profesores",identifier)
        await deleteDoc(items) 
        setChangedTable(!ChangedTable)
    }

    const [ChangedTable, setChangedTable] = useState(true);

    useEffect(() => {
        if (!isLoggedin) {
            navigate('/');
        } else {
            handleSelectItem()
            console.log(tableData)
        }
    }, [isLoggedin, navigate, ChangedTable, tableData]);

    return<>
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
                        label="Nombre"
                        required
                        value={item.nombre}
                        onChange={(event) => setItem({ ...item, nombre: event.target.value })}
                        sx={{ marginBottom: 2, background: 'white' }}
                    />
                    <TextField
                        label="Genero"
                        required
                        value={item.Genero}
                        onChange={(event) => setItem({ ...item, Genero: event.target.value })}
                        sx={{ marginBottom: 2, background: 'white' }}
                    />
                    <TextField
                        label="Asignatura"
                        required
                        value={item.Asignatura}
                        onChange={(event) => setItem({ ...item, Asignatura: event.target.value })}
                        sx={{ marginBottom: 2, background: 'white' }}
                    />
                    <TextField
                        label="Nº de telefono"
                        required
                        value={item.Numerotlf}
                        onChange={(event) => setItem({ ...item, Numerotlf: event.target.value })}
                        sx={{ marginBottom: 2, background: 'white' }}
                    >

                    </TextField>
                    <Button type="submit" variant="contained">
                        Insertar
                    </Button>
                </Box>
                <TableContainer style={{ maxHeight: '400px', overflow: 'auto', background: "white"}}>
                    <Table aria-label="tabla">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ color: 'black' }}></TableCell>
                                <TableCell style={{ color: 'black' }}>nombre</TableCell>
                                <TableCell style={{ color: 'black' }}>Genero</TableCell>
                                <TableCell style={{ color: 'black' }}>Asignatura </TableCell>
                                <TableCell style={{ color: 'black' }}>Nº de telefono</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {userData.userRol === 'admin' &&
                                            <Tooltip title="Si le das aqui borraras al profesor" arrow>
                                                <Button onClick={() => handleDeleteItem(row.id)}>
                                                    <WavingHandIcon />
                                                </Button>
                                            </Tooltip>}
                                    </TableCell>
                                    <TableCell>{row.nombre}</TableCell>
                                    <TableCell>{row.Genero}</TableCell>
                                    <TableCell>{row.Asignatura}</TableCell>
                                    <TableCell>{row.Numerotlf}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
        </div>
    </>
}


export default Zonapruebas
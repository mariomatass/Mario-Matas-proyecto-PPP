import React, { useState, useEffect } from "react";
import { db } from "../Firebaseconfig";
import { useSelector } from 'react-redux';
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Typography, Box, List, ListItem, ListItemText, Tooltip, IconButton } from "@mui/material";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Topbar from "./Topbar";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const userId = useSelector(state => state.login.userId);

  useEffect(() => {
    const fetchData = async () => {
      const favoritesRef = collection(db, "favoritos");
      const q = query(favoritesRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const favoritesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFavorites(favoritesData);
    };
    fetchData();
  }, [userId]);

  const handleRemoveFavorite = async (id) => {
    try {
      await deleteDoc(doc(db, "favoritos", id));
      setFavorites(favorites.filter((favorite) => favorite.id !== id));
    } catch (error) {
      console.error("Error al eliminar el libro favorito:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <Topbar />
      <div style={{ width: '100%' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding={2}
        >
          <Typography variant="h4" gutterBottom>
            Libros Favoritos
          </Typography>
          {favorites.length > 0 ? (
            <List>
              {favorites.map((favorite, index) => (
                <ListItem key={index}>
                  <img src={`https://covers.openlibrary.org/b/olid/${favorite.coverEditionKey}-S.jpg`} alt={favorite.Titulo} style={{ marginRight: "10px", width: "50px", height: "100px" }} />
                  <ListItemText
                    primary={favorite.Titulo}
                    secondary={favorite.Autor}
                    style={{ backgroundColor: "white", padding: "8px", borderRadius: "5px" }}
                  />
                  <Tooltip title="Eliminar libro de favoritos">
                    <IconButton onClick={() => handleRemoveFavorite(favorite.id)}>
                      <RemoveCircleIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">
              No hay libros favoritos.
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default FavoritesPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Typography, Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Topbar from "./Topbar";
import { collection, doc, deleteDoc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebaseconfig";
import { useSelector } from 'react-redux';

const OpenLibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookData, setBookData] = useState([]);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const userId = useSelector(state => state.login.userId);

  useEffect(() => {
    fetchFavoriteBooks();
  }, []);

  const fetchFavoriteBooks = async () => {
    try {
      const favoritesSnapshot = await getDocs(collection(db, "favoritos"));
      const favoritesData = favoritesSnapshot.docs.map(doc => doc.data());
      setFavoriteBooks(favoritesData);
    } catch (error) {
      console.error("Error al obtener libros favoritos:", error);
    }
  };

  const searchBooks = async () => {
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?q=${searchTerm}`
      );
      const books = response.data.docs;
      if (books && books.length > 0) {
        const bookInfo = books.slice(0, 5).map(async (book) => {
          const Autor = book.author_name ? book.author_name[0] : "Autor desconocido";
          const Titulo = book.title;
          const coverEditionKey = book.cover_edition_key;
          const coverURL = `https://covers.openlibrary.org/b/olid/${coverEditionKey}-S.jpg`;
          return { Autor, Titulo, coverURL, coverEditionKey };
        });
        const bookDataWithCovers = await Promise.all(bookInfo);
        setBookData(bookDataWithCovers);
      } else {
        setBookData([]);
      }
    } catch (error) {
      console.error("Error al buscar libros:", error);
    }
  };

  const isBookFavorite = (coverEditionKey) => {
    return favoriteBooks.some(book => book.coverEditionKey === coverEditionKey);
  };

  const toggleFavorite = async (book) => {
    const favoriteRef = doc(collection(db, "favoritos"), book.coverEditionKey);
    if (isBookFavorite(book.coverEditionKey)) {
      await deleteDoc(favoriteRef);
    } else {
      await setDoc(favoriteRef, {
        coverEditionKey: book.coverEditionKey,
        userId: userId,
        Titulo: book.Titulo,
        Autor: book.Autor
      });
    }
    fetchFavoriteBooks();
  };

  return (
    <div style={{display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      <Topbar />
      <div style={{width: '100%'}}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding={2}
        >
          <Typography variant="h4" gutterBottom>
            Buscar Libros en Open Library
          </Typography>
          <TextField
            label="Nombre del Libro"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "16px", width: "300px", background: "white" }}
          />
          <button onClick={searchBooks} style={{ marginBottom: "16px" }}>
            Buscar
          </button>
          {bookData.length > 0 && (
            <div>
              <Typography variant="h7" gutterBottom>
                Información de los primeros libros que hay en la API, hasta un maximo de 5:
              </Typography>
              <List>
                {bookData.map((book, index) => (
                  <ListItem key={index}>
                    <img src={book.coverURL} alt={book.Titulo} style={{ marginRight: "10px", width: "50px", height: "100px" }} />
                    <ListItemText primary={`Titulo: ${book.Titulo}`} secondary={`Autor: ${book.Autor}`} style={{ backgroundColor: "white", padding: "8px", borderRadius: "5px" }} />
                    <IconButton onClick={() => toggleFavorite(book)}>
                      { isBookFavorite(book.coverEditionKey) ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
                    </IconButton>
                  </ListItem>
                ))}
              </List> 
            </div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default OpenLibraryPage;


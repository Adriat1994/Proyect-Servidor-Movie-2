const express = require('express');

// Requerimos el archivo de configuración de nuestra DB
require('./utils/db');
const Movie = require('./models/Movie');
const movieRoutes = require('./routes/movies.routes');

const Cinema = require('./models/Cinema');
const cinemaRoutes = require('./routes/cinema.routes');


const PORT = 3000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

//La ruta para ver las peliculas totales es http://localhost:3000/movies/movies, ya no es http://localhost:3000/movies, porque se lo estamos indicando en la linea 16 con un /movies
server.use('/movies', movieRoutes);
server.use('/cinemas', cinemaRoutes);

server.use('*', (req, res, next) => {
	const error = new Error('Route not found'); 
	error.status = 404;
	next(error); 
  });

server.use((error, req, res, next) => {
	return res.status(error.status || 500).json(error.message || 'Unexpected error');
});

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
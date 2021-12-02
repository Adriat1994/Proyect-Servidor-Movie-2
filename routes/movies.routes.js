// Archivo movies.routes.js dentro de la carpeta routes
const express = require('express');

const Movie = require('../models/Movie');

const router = express.Router();


//Endpoint que devuelve todas las peliculas http://localhost:3000/movies/movies
router.get('/movies', (req, res) => {
    return Movie.find()
    .then(movies => {
        // Si encontramos los personajes, los devolveremos al usuario
        return res.status(200).json(movies);
    })
    .catch(err => {
        // Si hay un error, enviaremos por ahora una respuesta de error.
        return res.status(500).json(err);
    });
});

//Endpoint que devuelve una pelicula por su id, Ejemplo: http://localhost:3000/movies/movies/61a6695558c167de9349c328
router.get('/movies/:id', async (req, res) => {
	const id = req.params.id;
	try {
		const movie = await Movie.findById(id);
		if (movie) {
			return res.status(200).json(movie);
		} else {
			return res.status(404).json('No movie found by this id');
		}
	} catch (err) {
		return res.status(500).json(err);
	}
});


//Endpoint que devuelve una pelicula por su titulo, Ejemplo: http://localhost:3000/movies/movies/title/The%20Matrix
router.get('/movies/title/:title', async (req, res) => {
	const {title} = req.params;

	try {
		const movieByTitle = await Movie.find({ title: title });
		return res.status(200).json(movieByTitle);
	} catch (err) {
		return res.status(500).json(err);
	}
});


//Endpoint que devuelve las películas por su genero, Ejemplo: http://localhost:3000/movies/movies/genre/Acci%C3%B3n
router.get('/movies/genre/:genre', async (req, res) => {
	const {genre} = req.params;

	try {
		const movieByGenre = await Movie.find({ genre: genre });
		return res.status(200).json(movieByGenre);
	} catch (err) {
		return res.status(500).json(err);
	}
});

//Endpoint que devuelve las peliculas estrenadas a partir de 2010, Ejemplo: http://localhost:3000/movies/movies/year/2010
router.get('/movies/year/:year', async (req, res) => {
	const {year} = req.params;

	try {
		const movieByYear = await Movie.find({ year: {$gt:year} });
		return res.status(200).json(movieByYear);
	} catch (err) {
		return res.status(500).json(err);
	}
});



router.get('/', async (req, res, next) => {
	try {
		const movies = await Movie.find();
		return res.status(200).json(movies)
	} catch (error) {
		return next(error)
	}
});

//Metodo post que crea una nueva pelicula, Postman: http://localhost:3000/movies/create
router.post('/create', async (req, res, next) => {
    try {
      // Crearemos una instancia de movie con los datos enviados
      const newMovie = new Movie({
        title: req.body.title,
        director: req.body.director,
        year: req.body.year,
        genre: req.body.genre
      });
  
      // Guardamos la pelicula en la DB
      const createdMovie = await newMovie.save();
      return res.status(201).json(createdMovie);
    } catch (error) {
          // Lanzamos la función next con el error para que lo gestione Express
      next(error);
    }
});


//Metodo delete que elimina una pelicula, Postman: http://localhost:3000/movies/61a9067f8eb3e5c8d2f85c31
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        // No será necesaria asignar el resultado a una variable ya que vamos a eliminarlo
        await Movie.findByIdAndDelete(id);
        return res.status(200).json('Movie deleted!');
    } catch (error) {
        return next(error);
    }
});


//Metodo put que modifica una pelicula, Postman: http://localhost:3000/movies/edit/61a7b3895ab56c7c40455c5b
router.put('/edit/:id', async (req, res, next) => {
    try {
        const { id } = req.params //Recuperamos el id de la url
        const movieModify = new Movie(req.body) //instanciamos un nuevo Movie con la información del body
        movieModify._id = id //añadimos la propiedad _id a la movie creada
        const movieUpdated = await Movie.findByIdAndUpdate(id , movieModify)
        return res.status(200).json(movieUpdated)//Esta movie que devolvemos es el anterior a su modificación
    } catch (error) {
        return next(error)
    }
});




module.exports = router;
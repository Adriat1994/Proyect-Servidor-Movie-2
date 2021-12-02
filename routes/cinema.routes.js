const express = require('express');

const Cinema = require('../models/Cinema');

const router = express.Router();


//Endpoint GET, Postman: http://localhost:3000/cinemas/cinemas
router.get('/cinemas', (req, res) => {
    return Cinema.find()
    .then(cinemas => {
        // Si encontramos los personajes, los devolveremos al usuario
        return res.status(200).json(cinemas);
    })
    .catch(err => {
        // Si hay un error, enviaremos por ahora una respuesta de error.
        return res.status(500).json(err);
    });
});


//Endpoint POST, Postman: http://localhost:3000/cinemas/create
router.post('/create', async (req, res, next) => {
    try {
        const newCinema = new Cinema({
            name: req.body.name,
            location: req.body.location,
            movies: []
        });
        const createdCinema = await newCinema.save();
        return res.status(201).json(createdCinema);
    } catch (error) {
        next(error);
    }
});


//Endpoint PUT, Postman: http://localhost:3000/cinemas/edit/61a93dbaa1cf9c81c9f36c14
router.put('/edit/:id', async (req, res, next) => {
    try {
        const { id } = req.params //Recuperamos el id de la url
        const cinemaModify = new Cinema(req.body) //instanciamos un nuevo Movie con la información del body
        cinemaModify._id = id //añadimos la propiedad _id a la movie creada
        const cinemaUpdated = await Cinema.findByIdAndUpdate(id , cinemaModify)
        return res.status(200).json(cinemaUpdated)//Esta movie que devolvemos es el anterior a su modificación
    } catch (error) {
        return next(error)
    }
});


//Endpoint DELETE, Postman: http://localhost:3000/cinemas/61a93dbaa1cf9c81c9f36c14
router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        // No será necesaria asignar el resultado a una variable ya que vamos a eliminarlo
        await Cinema.findByIdAndDelete(id);
        return res.status(200).json('Cinema deleted!');
    } catch (error) {
        return next(error);
    }
});


//Modelo que inserta peliculas en cinema
router.put('/add-movie', async (req, res, next) => {
    try {
        const { cinemaId } = req.body;
        const { movieId } = req.body;
        const updatedCinema = await Cinema.findByIdAndUpdate(
            cinemaId,
            { $push: { movie: movieId } },
            { new: true }
        );
        return res.status(200).json(updatedCinema);
    } catch (error) {
        return next(error);
    }
});
//Insertamos una primera pelicula con id: 61a7b3895ab56c7c40455c5b en el cinema con id 61a92da320d81b60e963ba4b, mediante Postman http://localhost:3000/cinemas/add-movie
//Insertamos una segunda pelicula con id: 61a7b3895ab56c7c40455c56 en el cinema con id 61a92da320d81b60e963ba4b, mediante Postman http://localhost:3000/cinemas/add-movie






module.exports = router;
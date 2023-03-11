const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const {postCarrito  } = require('../controllers/carrito');
// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

//Manejo de rutas
router.post('/productos', [
    
    validarJWT,
    validarCampos,
] ,postCarrito);


module.exports = router;
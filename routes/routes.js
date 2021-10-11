const express = require('express');
const router = express.Router();
const customerController = require('../controllers/controllers'); 


router.get('/login', customerController.login);

router.get('/register', customerController.register);

router.get('/registers', customerController.usuarioRegistrado);

// 10-- Registro en base de datos metodo POST
router.post('/register', customerController.dbregister);

    //11-- Autenticacion
router.post('/auth', customerController.auth);

// 12-- autenticacion para el resto de las paginas
router.get('/', customerController.seguridad);

// 13 -- Logout
router.get('/logout', customerController.logout);

// pagina de ticket
router.get('/ticket', customerController.ticket);

// post de crar ticket
router.post('/tick', customerController.dbticket);

// get para borrar
router.get('/tickets/:TiId', customerController.delete);





module.exports = router;
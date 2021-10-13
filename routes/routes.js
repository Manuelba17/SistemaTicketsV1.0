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

// 13 -- Logout
router.get('/logout', customerController.logout);

// pagina de crear ticket
router.get('/create', customerController.create);
router.post('/tick', customerController.save);
router.get('/edit/:TiId', customerController.edit);
router.post('/actualizar',customerController.update);
router.get('/delete/:TiId', customerController.delete);


// 12-- pagina de raiz
router.get('/', customerController.raiz);







module.exports = router;
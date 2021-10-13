
//1--Invocamos Express
const express = require('express');
const app = express();

//2-- Seteamos url encoder, para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3-- Invocamos a Dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./.env'})

//4-- Setear el directorio public
app.use('/resource', express.static('public'));
app.use('/resource', express.static(__dirname + 'public'));

//console.log(__dirname); //Log para verificar el dirname, se utiliza para poder utilizar el codigo en cualquier computador

//5-- Establecer el motor de plantillas

app.set('view engine', 'ejs');



//7 -- Variables de sesión
const sesion = require('express-session');
app.use(sesion({
    secret:'secret', //Se puede colocar cualquier clave
    resave:true, // La forma en que se van a guardar las sessiones
    saveUninitialized: true

}))



// 9-- Importando rutas
const customerRoute = require('./routes/routes');

// Mis rutas

app.use('/', customerRoute);


app.listen(3000, (req, res) => {

console.log('SERVER IS RUNNING IN http://localhost:3000');

})
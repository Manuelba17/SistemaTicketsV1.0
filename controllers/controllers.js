//  Invocamos a Bryptjs
const bcryptjs = require('bcryptjs');

//  Invocamos al modulo de conexion de la base de datos
const connection = require('../database/db');
const session = require('express-session');
const { render } = require('ejs');

const controller = {};

// pagina de login
controller.login = (req, res)=>{
   
    res.render('login');
};

//pagina de registro 
controller.register = (req, res)=>{
  
    res.render('register');
};

// Registro en la base de datos
controller.dbregister = async(req, res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const company = req.body.company;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    if(user){
        connection.query('SELECT * FROM usuarios WHERE UsUsuario = ?', [user], async(error,results)=>{
         if(results == 0){
            connection.query('INSERT INTO usuarios SET ?', {UsUsuario:user, UsNombre:name, UsPassword:passwordHaash, UsCompany:company}, async(error,results)=>{
                if(error){
                    console.log(error);
                }else
                res.render('registers');
        
            })

         } else{
            // console.log('El usuario ya existe en el sistema');
            res.render('register', {                    
                alert:true,
                alertTitle:"Opps....",
                alertMessage:"El usuario ya existe",
                alertIcon:'warning',
                ruta:'register',     
                timer:'false' ,
                showConfirmButton: true,  
          })
         }
        })
    }
    }

// Pagina de usuario registrado
controller.usuarioRegistrado =(req, res)=>{
  
    res.render('registers');
}

// Autenticacion de la pagina
controller.auth = async(req,res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

  if(user && pass){
        connection.query('SELECT * FROM usuarios WHERE UsUsuario = ?', [user], async(error,results)=>{
           if(results ==0 || !(await bcryptjs.compare(pass, results[0].UsPassword))){
                res.render('login', {                    
                    alert:true,
                    alertTitle:"Opps....",
                    alertMessage:"Usuario o password incorrecto",
                    alertIcon:'error',
                    ruta:'login',     
                    timer:'false' ,
                    showConfirmButton: true,  
              })
            }else {
                req.session.loggedin =true;
            req.session.name = results[0].UsNombre
            res.render('login', {
                alert:true,
                alertTitle:"Felicitaciones",
                alertMessage:"Usuario conectado",
                alertIcon:'success',
                ruta:'',   
                showConfirmButton: false,
                timer:  1500
                 })
                 }                        
        })
    }
}

// Autenticacion para el resto de las paginas
controller.seguridad = (req,res) =>{
    if(req.session.loggedin){
            res.render('index',{
                login:true,
                name: req.session.name        
            });
       }else{
           res.render('index',{
               login:false,
               name: 'Debe iniciar sesion'
           })
       }
}

// Logout
controller.logout = (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
}
// pagina de crear ticket y listar los tickets
controller.ticket = async(req,res) =>{
        
    connection.query('SELECT * FROM tickets', async(error,results)=>{

    if(req.session.loggedin){
            res.render('ticket',{
                login:true,
                name: req.session.name,
                data: results
            })}else{
           res.render('index',{
               login:false,
               name: 'Debe iniciar sesion'
           })
       }
})
}

// registro en la base de datos del ticket
controller.dbticket = async(req, res)=>{
    const data = req.body

    connection.query('INSERT INTO tickets SET ?', [data], async(error,results)=>{
        if(error){
            console.log(error);
        }else{
            req.session.loggedin =true;
            res.render('login', {
            alert:true,
            alertTitle:"Felicitaciones",
            alertMessage:"El ticket se a creado",
            alertIcon:'success',
            ruta:'ticket',   
            showConfirmButton: false,
            timer:  1500
             })
        }
        
    })
}

// funcion de borrado en la tabla tickets
controller.delete = async(req,res) =>{   
   const {TiId} = req.params;
   console.log(TiId);
   
    connection.query('DELETE FROM tickets WHERE TiId = ?', [TiId], (error, rows)=>{

        if(req.session.loggedin){
           
            res.redirect('/')
       }else{
           res.render('index',{
               login:false,
               name: 'Debe iniciar sesion'
           })
       }


    } )

    }


module.exports = controller;
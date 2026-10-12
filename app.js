require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { validateUser } = require('./utils/validation.js');
const fs = require('fs');
const path = require('path');
const { error } = require('console');
const userFilePath = path.join(__dirname,'users.json');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(PORT);

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso Express.js v1</h1>
        <p>Esto es una aplicación node.js con express.js</p> 
        <p>Corre en el puerto ${PORT}</p>       
    `);
});


app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`Mostrar información del usuario con ID: ${userId}`);
});

app.get('/search', (req, res) => {
  const terms = req.query.termino || "no especificado";
  const category = req.query.categoria || "todas";
  
  res.send(`<h2>Resultados de búsqueda</h2>
            <p>Término: ${terms}</p>
            <p>Categoría: ${category}</p>`);
});


app.post('/form', (req, res) => {
    const name = req.body.nombre || "anónimo";
    const email = req.body.email || "no proporcionado";
    
    res.json({
        message: "Datos recibidos",
        data: {
            name,
            email
        }
    });
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    
    // Validación para asegurar que recibimos datos válidos
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
            error: "No se recibieron datos"
        });
    }
    
    res.status(200).json({
        message: "Datos JSON recibidos",
        data
    });
});

//Leer Usuarios
app.get('/users',(req,res) => {
    fs.readFile(userFilePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({error:'Error con conexión de datos...'});
        }
        const users = JSON.parse(data);
        res.json(users);
    });
});

//Crear Usuario
app.post('/users', (req, res) => {
  const newUser = req.body;

   
        const fs = require('fs');

        fs.readFile(userFilePath, 'utf-8', (error, data) => {
        if (error) {
            return res.status(500).json({ error: "Error con conexión de datos" });
        }
        
        const users = JSON.parse(data);

        validateUser(newUser, users);
  
        if (!validateUser.isValid) {
            return res.status(400).json({ error: validateUser.errors });
        }

        // Agregar el nuevo usuario
        users.push(newUser);

        // Guardar la información actualizada
        fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (error) => {
            if (error) {
                return res.status(500).json({ error: "Error al guardar el usuario" });
            }
            
            // Responder con el usuario creado
            res.status(201).json(newUser);
            });

        });


});

//Actualizar
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const updateUser = req.body;

    const validation = validateUser(updatedUser, users);
  
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.errors });
    }
    
    // Leemos el archivo de usuarios
    fs.readFile(userFilePath, 'utf8', (error, data) => {
        if (error) {
        return res.status(500).json({ error: "Error con conexión de datos" });
        }
        
        // Parseamos los datos JSON
        let users = JSON.parse(data);
        
        // Actualizamos el usuario que coincida con el ID
        users = users.map(user => {
        return user.id === userId ? { ...user, ...updateUser } : user;
        });
        
        // Guardamos los cambios en el archivo
        fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: "Error al actualizar el usuario" });
        }
        
        // Respondemos con el usuario actualizado
        res.json(updateUser);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}`)
});
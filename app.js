require('dotenv').config();
const express = require('express');
const app = express();
const bodyparse = require('body-parse');

const PORT = process.env.PORT || 3000;
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: true}));

console.log(PORT);

app.get('/', (req, res) => {
    res.send(`
        <h1>Curso Express.js v1</h1>
        <p>Esto es una aplicación node.js con express.js</p> 
        <p>Corre en el puerto ${PORT}</p>       
    `);
});

app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}`)
});